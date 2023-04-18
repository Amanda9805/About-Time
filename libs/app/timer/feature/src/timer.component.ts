import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TimerState } from '@mp/app/timer/data-access';
import { SetUserTime } from '@mp/app/timer/util';
import { Observable } from 'rxjs/internal/Observable';
import { UserTime } from '@mp/api/feed/util';

@Component({
  selector: 'mp-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Select(TimerState.userTime) userTime$!: Observable<UserTime>;

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

    this.startTimer();
  }

  startTimer(){
      this.hours = Math.floor(this.allocatedTime / 3600);
      this.minutes = Math.floor((this.allocatedTime % 3600) / 60);
      this.seconds = this.allocatedTime % 60;
  }

}
