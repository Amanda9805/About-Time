import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SearchState } from './search.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([SearchState])],
})
export class SearchModule {}