import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchPage } from './search.page';
import { SearchRouting } from './search.routing';
import { TimerModule } from '@mp/app/timer/feature';
import { SearchApi } from '@mp/app/search/data-access';
import { NgxsModule } from '@ngxs/store';
import { FeedState } from '@mp/app/feed/data-access';

@NgModule({
  imports: [CommonModule, IonicModule, SearchRouting, TimerModule, NgxsModule.forFeature([FeedState])],
  declarations: [SearchPage],
  providers: [SearchApi],
})
export class SearchModule { }
