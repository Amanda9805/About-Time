import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsApi } from './settings.api';

@NgModule({
    imports: [CommonModule],
    providers: [SettingsApi]
})

export class SettingsModule { };