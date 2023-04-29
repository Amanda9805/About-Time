import { Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router, NavigationExtras } from '@angular/router';
import { IDeleteAccountRequest, IFetchProfileRequest, PrivacyStatus, Status, IUpdatePrivacySettingsRequest } from '@mp/api/profiles/util';
import { ProfilesApi } from '@mp/app/profile/data-access';
import { Store } from '@ngxs/store';
import { IProfile } from '@mp/api/profiles/util';
import { AuthState } from '@mp/app/auth/data-access';
import { OtherUserApi } from '@mp/app/other-user/data-access';
import { SetError } from '@mp/app/errors/util';
import { SettingsApi } from '@mp/app/settings/data-access';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  // profileRepo = new ProfilesRepository();
  toggle = document.getElementById('my-toggle');
  @ViewChild(IonModal)
  modal!: IonModal;
  public alertButtons = ['Yes', 'No'];
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  username!: string;

  constructor(public alertController: AlertController, private location: Location, private router: Router, private store: Store, private readonly profilesApi: ProfilesApi, private readonly otherUserApi: OtherUserApi, private api: SettingsApi) {
  }

  private sendfile: any;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async deleteAccount() {
    // const userID = this.store.selectSnapshot(AuthState).user.uid;
    // const request: IFetchProfileRequest = {
    //   user: {
    //     id: userID,
    //   }
    // }

    // // First call the api fetchUserPosts function
    // const responseRef = await this.otherUserApi.fetchProfile(request);
    // const response = responseRef.data;

    // const deleteAccountRequest = {
    //   deleteAccount: response.profile as IProfile
    // } as IDeleteAccountRequest;

    // const result = await this.profilesApi.deleteAccount(deleteAccountRequest);

    // if (result.data.status === Status.SUCCESS) {
    //   console.log("Account deletion sucessful.")
    //   this.router.navigate(['/welcome']);
    // }
    // else {
    //   console.log("Account deletetion failed.")
    //   alert('Failed to delete account');

    // }
    this.api.deleteAccount();
  }

  async changeUsername() {
    if (!this.username) {
      this.store.dispatch(new SetError("You are missing a new username"));
    } else {
      await this.api.updateUsername(this.username);
    }
  }

  async handlePicture(event: any) {
    if (event.target.files && event.target.files.length) {
      this.sendfile = event.target.files[0];
    }
  }

  async updateProfilePicture() {
    if (!this.sendfile) {
      this.store.dispatch(new SetError("You are missing a profile picture"));
    } else {
      await this.api.uploadPicture(this.sendfile);
    }
  }

  goBack() {
    this.location.back();
  }

  onToggleChange(event: any) {
    console.log('Toggle changed', event.detail.checked);
  }

  onUsernameChange(event: any) {
    this.username = event.target.value as string;
  }

  async toggleProfileVisibility() {
    //Need to get the user and then the function should be done but It still needs to be tested;
    // Create the request using the passed in user

    const userID = this.store.selectSnapshot(AuthState).user.uid;
    const request: IFetchProfileRequest = {
      user: {
        id: userID,
      }
    }

    // First call the api fetchUserPosts function
    const responseRef = await this.otherUserApi.fetchProfile(request);
    const response = responseRef.data;

    let newPrivacy;
    if (this.toggle?.ariaChecked) {
      newPrivacy = PrivacyStatus.PRIVATE
    }
    else {
      newPrivacy = PrivacyStatus.PUBLIC;
    }

    const updateRequest = {
      privacySettings: {
        newStatus: newPrivacy,
        profile: response.profile,
      }
    } as IUpdatePrivacySettingsRequest;

    const result = this.profilesApi.updatePrivacySetting(updateRequest);
    console.log(result);
  }

  onSliderChange(event: any) {
    console.log('Slider changed', event.detail.value);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: 'You are about to delete your account',
      message: 'Are you sure?',
      buttons: this.alertButtons
    });

    await alert.present();
  }

  onSave() {
    // code to save settings
    // this.storage.set('option1', this.option1);
    // this.storage.set('option2', this.option2);
    // this.storage.set('sliderValue', this.sliderValue);

    console.log('Settings saved');
  }

  navigate(to: string) {
    switch (to) {
      case 'pp': {
        this.router.navigate(['/privacy']);
        break;
      }
      case 'tos': {
        this.router.navigate(['/tos']);
        break;
      }
      case 'fp': {
        const navigationExtras: NavigationExtras = {
          state: {
            title: "Change your password"
          }
        };
        this.router.navigate(['/forgot'], navigationExtras);
        break;
      }
    }
    return;
  }
}
