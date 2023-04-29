import { Component, EventEmitter, Output, Input, ChangeDetectorRef, SimpleChanges, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FilterList, FilterType, Post, PostList } from '@mp/api/feed/util';

import { Store } from '@ngxs/store';
import { AuthState } from '@mp/app/auth/data-access';
import { getFirestore } from 'firebase-admin/firestore';
import { doc, docSnapshots, Firestore, collection, collectionSnapshots, collectionChanges } from '@angular/fire/firestore';
import {Observable, map} from 'rxjs';
import { onSnapshot } from "firebase/firestore";



@Component({
  selector: 'mp-feed-closed',
  templateUrl: './feed-closed.component.html',
  styleUrls: ['./feed-closed.component.scss']
})
export class FeedClosedComponent{

  @Input() posts: PostList = {
    postsFound: false,
    list: [],
  };

  filters: FilterList = {
    list: [],
  };



  constructor(private readonly firestore : Firestore, private store: Store) {
    this.filters.list?.push(
      FilterType.MOST_RECENT,
      FilterType.MOST_POPULAR,
      FilterType.SCIENCE_FILTER,
      FilterType.ART_FILTER,
      FilterType.FOOD_FILTER,
      FilterType.SPORT_FILTER,
      FilterType.NEWS_FILTER,
      FilterType.TRAVEL_FILTER,
      FilterType.MUSIC_FILTER,
      FilterType.GAMING_FILTER)

      //const app = firestore.app;
  }

  alreadyAdded = false;

  ngOnInit() {
    const ref = collection(this.firestore, 'Posts');

      const doc$ = collectionChanges(ref).pipe(map(data => data.at(0)?.doc.data() as Post));

      doc$?.subscribe(data => {
        if (data != undefined){
          this.posts.list?.forEach(element => {
            if(element.id == data.id)
            {
              this.alreadyAdded = true;
            }
          });
          if(!this.alreadyAdded){
            this.posts.list?.unshift(data);
          }
          this.alreadyAdded = false;

        // console.log("dispatch time: ", data['timeWat']);
        }
      });




  }


  @Output() filterChanged = new EventEmitter<FilterType>();
  @Output() setCurrentPost = new EventEmitter<Post>();

  onSetFilters(data: FilterType) {

    this.filterChanged.emit(data);
    const myElement = document.getElementById(data);
    if(myElement != null)
    {
      if(myElement.style.background != "green")
      {
        myElement.style.background = "green";
      }
      else{
          myElement.style.background = "black";
      }
    }
  }

  setPost(data: Post) {
    this.setCurrentPost.emit(data);
  }

  handleRefresh(event: any) {
    // const target = event.target as HTMLTextAreaElement;
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
    console.log("refreshing of data");
  }
}
