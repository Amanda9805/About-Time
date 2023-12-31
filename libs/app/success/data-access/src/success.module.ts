import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SuccessState } from './sucess.state';

@NgModule({
    imports: [CommonModule, NgxsModule.forFeature([SuccessState])],
})
export class SuccessModule { }