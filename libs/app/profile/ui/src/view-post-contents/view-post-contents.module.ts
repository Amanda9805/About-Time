import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewPostContentsComponent } from './view-post-contents.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ViewPostContentsComponent],
  exports: [ViewPostContentsComponent],
  entryComponents: [ViewPostContentsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewPostContentsModule {}
