import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FeedPage } from './feed.page';
import { FeedRouting } from './feed.routing';
import { FeedUIModule } from '@mp/app/feed/ui';
import { NgxsModule } from '@ngxs/store';
import { FeedApi, FeedState } from '@mp/app/feed/data-access';
import { TimerModule } from '@mp/app/timer/feature';

@NgModule({
  imports: [CommonModule, IonicModule, FeedRouting, FeedUIModule, TimerModule, NgxsModule.forFeature([FeedState])],
  declarations: [FeedPage],
  providers: [FeedApi],
})
export class FeedModule { }
