import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TimerState } from '@mp/app/timer/data-access';
import { SetUserTime, liveUpdateTime } from '@mp/app/timer/util';
import { Observable } from 'rxjs/internal/Observable';
import { UserTime } from '@mp/api/feed/util';
import { log } from 'console';
import { doc, docSnapshots, Firestore, collection, collectionChanges } from '@angular/fire/firestore';
import {map} from 'rxjs';
import { AuthState } from '@mp/app/auth/data-access';
import { set } from 'immer/dist/internal';

@Component({
  selector: 'mp-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Select(TimerState.userTime) userTime$!: Observable<UserTime>;

  @Input() feedOpen = false;

  protected hours = 0;
  protected minutes = 0;
  protected seconds = 0;
  protected allocatedTime = 0;

  constructor(private readonly firestore : Firestore, private store: Store) {

    this.store.dispatch(new SetUserTime());

    this.store.select(TimerState.userTime).subscribe((userTime) => {
      if (userTime.model != null)
        if (userTime.model.timeAmount != null) {
          this.allocatedTime = userTime.model.timeAmount;
        }
    })

    this.setTime();
  }

  ngOnInit(){


    const user = this.store.selectSnapshot(AuthState).user.uid;
    console.log('test2');
    const ref = doc(this.firestore, 'profiles', user);

    const doc$ = docSnapshots(ref).pipe(map(data => data.data()));


  //   const unsub = onSnapshot(doc(this.firestore, "profiles", user), (doc) => {
  //     console.log("Current data: ", doc.data());
  // });

    doc$?.subscribe(data => {
      if (data != null)
      this.store.dispatch(new liveUpdateTime({time: data['time']}));
      console.log(data);
    });
  }

  ngOnChanges() {
    if (this.feedOpen) {
      this.startTimer();
    }else{
      this.test();
    }
  }

  test(){
    setInterval(() => {
      this.setTime();
    }, 1000);

  }

  startTimer() {
    console.log("start TImer");
    setInterval(() => {
      this.allocatedTime--;
      this.setTime();
    }, 1000);
  }

  setTime() {
    this.hours = Math.floor(this.allocatedTime / 3600);
    this.minutes = Math.floor((this.allocatedTime % 3600) / 60);
    this.seconds = this.allocatedTime % 60;
  }

}
