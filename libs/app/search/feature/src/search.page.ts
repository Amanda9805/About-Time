import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SetProfilesList } from '@mp/app/search/util';
import { SearchState } from '@mp/app/search/data-access';
import { ProfilesList } from '@mp/api/search/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'mp-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage {

  @Select(SearchState.profilesList) profileList$!: Observable<ProfilesList>;


  profilesData: ProfilesList = {
    userFound : false,
    list : [],
  };

  constructor(private store: Store){

  }

  ngOnInit(){

    this.store.dispatch(new SetProfilesList({username: ''}));

    this.store.select(SearchState.profilesList).subscribe((profiles) => {
      if (profiles.model.list != null){

        this.profilesData.userFound = true;

        profiles?.model.list?.forEach((profile) => {
          this.profilesData.list?.push(profile);
        })
      }
     })
  }


  search(event : any){
    this.profilesData.list = [];//reset the list
    this.store.dispatch(new SetProfilesList({username: event.target.value}));

  }


}

