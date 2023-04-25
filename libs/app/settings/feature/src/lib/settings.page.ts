import { Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {

  privacy = false;
  sliderValue = 50;
  @ViewChild(IonModal)
  modal!: IonModal;
  public alertButtons = ['Yes', 'No'];
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  constructor(public alertController: AlertController, private location: Location, private router: Router) {

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

  goBack() {
    this.location.back();
  }

  onToggleChange(event: any) {
    console.log('Toggle changed', event.detail.checked);
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
