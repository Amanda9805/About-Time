import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccountDetailsModule } from './account-details';
import { ProfileStatusModule } from './profile-status';
import { ViewPostContentsModule } from './view-post-contents';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AccountDetailsModule,
    ProfileStatusModule,
    ViewPostContentsModule
  ],
  exports: [
    AccountDetailsModule,
    ProfileStatusModule,
    ViewPostContentsModule
  ],
})
export class ProfileModule { }
