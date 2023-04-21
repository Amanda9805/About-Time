import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { TimerState } from './timer.state';
import { FeedApi } from '@mp/app/feed/data-access';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TimerState])],
   providers: [FeedApi],
})
export class TimerModule {}
