import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Discipline, FilterType, Post, PostList, TimeModification } from '@mp/api/feed/util';
import { AuthState } from '@mp/app/auth/data-access';
import { FeedState } from '@mp/app/feed/data-access';
import { SetUserTimeModification } from '@mp/app/timer/util';
import { Store, Select } from '@ngxs/store';
import { start } from 'repl';
import { doc, docSnapshots, Firestore, collection, collectionChanges } from '@angular/fire/firestore';
import {Observable, map} from 'rxjs';
import { liveUpdatePostTime } from '@mp/app/feed/util';

@Component({
  selector: 'mp-feed-open',
  templateUrl: './feed-open.component.html',
  styleUrls: ['./feed-open.component.scss'],
})
export class FeedOpenComponent {

  image = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';

  @Select(FeedState.post) post$!: Observable<Post>;

  @Input() posts: PostList = {
    postsFound: false,
    list: [],
  };

  totalPostTime = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  @Input() currentPost = 0;
  feedOpen = true;
  constructor(private readonly firestore : Firestore, private store: Store) {
    this.store.select(FeedState.post).subscribe((post) => {
      if (post != null)
        this.totalPostTime = post.model.time as number;
    })
  }

  // posts : PostList = {
  //   postsFound : false,
  //   list : [
  //     {
  //       id : "post 1",
  //       title : "Title 1",
  //       author : null,
  //       description : "description 1",
  //       content : "content 1",
  //       discipline : Discipline.SCIENCE,
  //       time : 0,
  //   },
  //   {
  //     id : "post 2",
  //     title : "Title 2",
  //     author : null,
  //     description : "description 2",
  //     content : "content 2",
  //     discipline : Discipline.SCIENCE,
  //     time : 0,
  // },
  // {
  //   id : "post 3",
  //   title : "Title 3",
  //   author : null,
  //   description : "description 3",
  //   content : "content 3",
  //   discipline : Discipline.SCIENCE,
  //   time : 0,
  // }
  //   ],
  // };

  startTime = 0;
  endTime = 0;

  @Output() setCurrentPost = new EventEmitter<Post>();
  @Output() retutnToFeedClosed = new EventEmitter<void>();
  @Output() updatePostTime = new EventEmitter<TimeModification>();

  currentPostIndex = 0;

  ngOnInit() {
    this.startTime = Date.now();
    this.setPost(this.posts.list?.at(this.currentPostIndex) as Post);
  }

  async ngOnDestroy() {
    this.endTime = Date.now();
    this.store.dispatch(new SetUserTimeModification({ time: -(this.endTime - this.startTime), userID: this.store.selectSnapshot(AuthState).user.uid }));
    this.updatePostTime.emit({
      postID: this.posts.list?.at(this.currentPostIndex)?.id as string,
      time: this.endTime - this.startTime,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPost']) {
      this.currentPostIndex = changes['currentPost'].currentValue;
    }
    this.startTimer();

  ///////////////////////
    const postID = this.posts.list?.at(this.currentPostIndex)?.id as string;
    console.log("postID: ", postID);
    const ref = doc(this.firestore, 'Posts', postID);

    const doc$ = docSnapshots(ref).pipe(map(data => data.data()));

    doc$?.subscribe(data => {

      if (data != undefined){
      //   console.log("data: ", data);
      // console.log("dispatch time: ", data['timeWat']);
      this.store.dispatch(new liveUpdatePostTime({time: data['timeWatched']}))
      }
    });



  }

  startTimer() {
    this.totalPostTime = this.posts.list?.at(this.currentPostIndex)?.time as number;
    setInterval(() => {
      this.totalPostTime++;
      this.setTime();
    }, 1000);
  }

  setTime() {
    this.hours = Math.floor(this.totalPostTime / 3600);
    this.minutes = Math.floor((this.totalPostTime % 3600) / 60);
    this.seconds = this.totalPostTime % 60;
  }

  setPost(data: Post) {
    this.setCurrentPost.emit(data);
  }

  tStart = 0;
  tEnd = 0;

  touchStart(e: TouchEvent) {
    this.tStart = e.touches[0].pageX;
  }

  touchEnd() {
    if (this.tEnd - this.tStart > -200 && this.tEnd - this.tStart < 200) {
      //swipe gesture not big enough to be considered a swipe
      //do nothing
    } else if (this.tEnd - this.tStart > 200) {
      //go back one post
      this.back();

    } else if (this.tEnd - this.tStart < -200) {
      //go forward one post
      this.forward();
    }
  }

  touchMove(e: TouchEvent) {
    this.tEnd = e.touches[0].pageX;
  }

  goBack() {
    this.retutnToFeedClosed.emit();
  }

  async back() {
    if (this.currentPostIndex > 0) {
      if (this.startTime != 0) {
        this.endTime = Date.now();
        this.store.dispatch(new SetUserTimeModification({ time: -(this.endTime - this.startTime), userID: this.store.selectSnapshot(AuthState).user.uid }));
        this.updatePostTime.emit({
          postID: this.posts.list?.at(this.currentPostIndex)?.id as string,
          time: this.endTime - this.startTime,
        });
      }
      this.startTime = Date.now();//reset timer

      console.log(this.posts?.list?.at(this.currentPostIndex))
      if (this.currentPostIndex > 0) {
        this.currentPostIndex--;
      }
      this.setPost(this.posts.list?.at(this.currentPostIndex) as Post);
    }
  }

  async forward() {
    if (this.posts.list != null)
      if (this.currentPostIndex < this.posts.list.length - 1) {
        if (this.startTime != 0) {
          this.endTime = Date.now();
          this.store.dispatch(new SetUserTimeModification({ time: -(this.endTime - this.startTime), userID: this.store.selectSnapshot(AuthState).user.uid }));
          this.updatePostTime.emit({
            postID: this.posts.list?.at(this.currentPostIndex)?.id as string,
            time: this.endTime - this.startTime,
          });
        }
        this.startTime = Date.now();//reset timer
        if (this.posts.list != null) {
          if (this.currentPostIndex < this.posts.list.length - 1) {
            this.currentPostIndex++;
          }
        }
        this.setPost(this.posts.list?.at(this.currentPostIndex) as Post);
        this.tStart = 0;
        this.tEnd = 0;
      }
  }




}
