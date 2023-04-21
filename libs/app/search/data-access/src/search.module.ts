import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SearchState } from './search.state';
import { SearchApi } from './search.api';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([SearchState])],
  providers: [SearchApi],
})
export class SearchModule {}
