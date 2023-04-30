import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CopyrightModule } from '@mp/app/copyright/ui';
import { VersionModule } from '@mp/app/version/ui';
import { LoadingPage } from './loading.page';
import { LoadingRouting } from './loading.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingRouting,
    CopyrightModule,
    VersionModule,
  ],
  declarations: [LoadingPage],
})
export class LoadingModule {}
