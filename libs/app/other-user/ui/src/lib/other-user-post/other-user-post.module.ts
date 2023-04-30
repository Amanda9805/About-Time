import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { OtherUserPostComponent } from './other-user-post.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSkeletonLoaderModule,
  ],
  declarations: [OtherUserPostComponent],
  exports: [OtherUserPostComponent]
})
export class OtherUserPostModule {}
