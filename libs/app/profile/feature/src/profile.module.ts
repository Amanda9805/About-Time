import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileModule as ProfileDataAccessModule, ProfileState, ProfilesApi } from '@mp/app/profile/data-access';
import { ProfileModule as ProfileUiModule } from '@mp/app/profile/ui';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxsModule } from '@ngxs/store';
import { ProfilePage } from './profile.page';
import { ProfileRouting } from './profile.routing';
import { OtherUserUIModule } from '@mp/app/other-user/ui';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileRouting,
    ProfileUiModule,
    ProfileDataAccessModule,
    NgxSkeletonLoaderModule,
    NgxsModule.forFeature([ProfileState]),
    OtherUserUIModule,
    RouterModule,
  ],
  declarations: [ProfilePage],
  providers: [ProfilesApi],
})
export class ProfileModule { }
