import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CreatePostPage } from './create-post.page';
import { CreatePostRouting } from './create-post.routing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CreatePostModule as CreatePostModuleDataAccess } from '@mp/app/create-post/data-access';

@NgModule({
  imports: [CommonModule, IonicModule, CreatePostRouting, HttpClientModule, ReactiveFormsModule, NgxSkeletonLoaderModule, CreatePostModuleDataAccess],
  declarations: [CreatePostPage],
  schemas: []
})

export class CreatePostModule { }