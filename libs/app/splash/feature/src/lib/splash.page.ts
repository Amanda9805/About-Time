import { Component } from '@angular/core';

@Component({
  selector: 'mp-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss']
})
export class SplashPage {
  ngOnInit() {
    setTimeout(() => {
      const element: HTMLElement = document.getElementById('trigger') as HTMLElement;
      element.click();
    }, 3000);
  }
}