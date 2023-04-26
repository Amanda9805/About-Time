import { Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router, NavigationExtras } from '@angular/router';
import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { PrivacyStatus, Status } from '@mp/api/profiles/util';
import { getPrivacySettings } from '@mp/api/core/feature';
import { current } from 'immer';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  profileRepo = new ProfilesRepository();
  toggle = document.getElementById('my-toggle');

//const user=; //ask how to get the current user
 // currentPrivacy: PrivacyStatus;
  sliderValue = 50;
  @ViewChild(IonModal)
  modal!: IonModal;
  public alertButtons = ['Yes', 'No'];
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  constructor(public alertController: AlertController, private location: Location, private router: Router) {
    //const user=; //ask how to get the current user
  }

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

  // async ngOnInit() {
  //   this.currentPrivacy = await this.profileRepo.getPrivacySettings(user);
  //   if (this.currentPrivacy === PrivacyStatus.PRIVATE) {
  //     this.toggle?.ariaChecked;
  //   }
  // }

  deleteAccount(){
    // try{
    //   //const profileRepo = new ProfilesRepository();
    //   const result = this.profileRepo.deleteAccount();//figure out how to get the users profile
    //   if(result == Status.SUCCESS)
    //   {
    //     console.log("Account deletion sucessful.")
    //     this.router.navigate(['/welcome']);
    //   }
    //   else{
    //     console.log("Account deletetion failed.")
    //     alert('Failed to delete account');

    //   }
    // }
    // catch(error){
    //   console.error(error)
    //   alert('Failed to delete account');
    // }
  }
  goBack() {
    this.location.back();
  }

  onToggleChange(event: any) {
    console.log('Toggle changed', event.detail.checked);
  }

  toggleProfileVisibility(){
    //Need to get the user and then the function should be done but It still needs to be tested;
    let newPrivacy;  
    if(this.toggle?.ariaChecked)
    {
      newPrivacy = PrivacyStatus.PRIVATE
    }
    else{
      newPrivacy = PrivacyStatus.PUBLIC;
    }
    const result = this.profileRepo.updatePrivacySettings(this.user,newPrivacy)
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
