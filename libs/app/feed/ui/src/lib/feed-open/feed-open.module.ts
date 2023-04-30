import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FeedOpenComponent } from './feed-open.component'
import { TimerModule } from '@mp/app/timer/feature';

@NgModule({
    declarations: [FeedOpenComponent],
    imports: [
        CommonModule, IonicModule, TimerModule
    ],
    exports: [FeedOpenComponent]
})
export class FeedOpenModule { }
