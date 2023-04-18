import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TimerComponent } from './timer.component';
import { RouterModule } from '@angular/router';
import { NgxsFeatureModule } from '@ngxs/store/src/modules/ngxs-feature.module';
import { TimerState } from '@mp/app/timer/data-access';
import { NgxsModule } from '@ngxs/store';
import { FeedApi } from '@mp/app/feed/data-access';

@NgModule({
  declarations: [TimerComponent],
  imports: [CommonModule, IonicModule, RouterModule, NgxsModule.forFeature([TimerState])],
  exports: [TimerComponent],
  providers: [FeedApi],
})
export class TimerModule {}
