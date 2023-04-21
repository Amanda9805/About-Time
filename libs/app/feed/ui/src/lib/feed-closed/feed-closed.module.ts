import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FeedClosedComponent } from './feed-closed.component'
import { NgxsModule } from '@ngxs/store';
import { TimerModule } from '@mp/app/timer/feature';



@NgModule({
    declarations: [FeedClosedComponent],
    imports: [
        CommonModule,
        IonicModule,
        TimerModule,
    ],
    exports: [FeedClosedComponent]
})
export class FeedClosedModule {}
