import { Component, EventEmitter, Output, Input, ChangeDetectorRef, SimpleChanges, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FilterList, FilterType, Post, PostList } from '@mp/api/feed/util';
import { doc, docSnapshots, Firestore, collection, collectionChanges } from '@angular/fire/firestore';
import {map} from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '@mp/app/auth/data-access';

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

  async getUserEventSummary() {
    try{
      const user = this.store.selectSnapshot(AuthState).user.uid;

      const ref = doc(this.firestore, 'profiles/', user);//fix path
      console.log(ref.path);
      console.log(docSnapshots(ref));
      return docSnapshots(ref).pipe(map(data => data.data()));
    }catch(e){
      console.log(e);
    }
    return;
  }

  async test(){
    const items = collection(this.firestore, 'profiles');
    collectionChanges(items).subscribe(data => {
      console.log(data);
    });


    const doc$ = await this.getUserEventSummary();

    doc$?.subscribe(data => {
      console.log(data);
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
