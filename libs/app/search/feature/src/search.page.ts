import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetProfilesList } from '@mp/app/search/util';

@Component({
  selector: 'mp-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage {

  constructor(private store: Store){}

  search(event : any){
     this.store.dispatch(new SetProfilesList({username: event.target.value}));
  }
}

