import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TimerState } from '@mp/app/timer/data-access';
import { SetUserTime } from '@mp/app/timer/util';
import { Observable } from 'rxjs/internal/Observable';
import { UserTime } from '@mp/api/feed/util';
import { log } from 'console';

@Component({
  selector: 'mp-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Select(TimerState.userTime) userTime$!: Observable<UserTime>;

  @Input() feedOpen = false;

  hours = 0;
  minutes = 0;
  seconds = 0;
  allocatedTime = 0;

  constructor(private store: Store) {

    this.store.dispatch(new SetUserTime());

    this.store.select(TimerState.userTime).subscribe((userTime) => {
      if(userTime.model != null)
      if (userTime.model.timeAmount != null){
        this.allocatedTime = userTime.model.timeAmount;
      }
     })

    this.setTime();

  }

  ngOnChanges(){
    if(this.feedOpen){
      this.startTimer();
    }
  }


  startTimer(){
    console.log("start TImer");
    setInterval(() => {
    this.allocatedTime--;
    this.setTime();
    }, 1000);
  }

  setTime(){
      this.hours = Math.floor(this.allocatedTime / 3600);
      this.minutes = Math.floor((this.allocatedTime % 3600) / 60);
      this.seconds = this.allocatedTime % 60;
  }

}
