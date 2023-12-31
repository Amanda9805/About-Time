import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { OtherUserPage } from './other-user.page';
import { OtherUserRouting } from './other-user.routing';
import { OtherUserUIModule } from '@mp/app/other-user/ui';
import { NgxsModule } from '@ngxs/store';
import { OtherUserApi, OtherUserState } from '@mp/app/other-user/data-access';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSkeletonLoaderModule,
    NgxsModule.forFeature([OtherUserState]),
    OtherUserRouting,
    OtherUserUIModule
  ],
  declarations: [OtherUserPage],
  providers: [OtherUserApi],
})
export class OtherUserModule {}
