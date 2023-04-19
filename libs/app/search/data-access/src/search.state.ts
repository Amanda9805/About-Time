import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import produce from 'immer';

import { MinimizedProfile, ProfilesList, SearchRequest, SearchResponse } from '@mp/api/search/util'
import { SetError } from '@mp/app/errors/util';
import {SetProfilesList} from '@mp/app/search/util';
import { SearchApi } from './search.api';

export interface SearchStateModel {

  minimizedProfile: MinimizedProfile | null;
  profilesList: ProfilesList | null;
  
  MinimizedProfile : {
    model: {
      username: string | null;
      imageUrl: string | null;
    };
    dirty: false;
    status: string;
    errors: object;
  }

  ProfilesList : {
    model: {
      userFound: boolean | null;
      list : MinimizedProfile [] | null;
    };
    dirty: false;
    status: string;
    errors: object;
  }
}

@State<SearchStateModel>({
  name: 'search',
  defaults: {
    minimizedProfile: null, 
    profilesList: null,

    MinimizedProfile: {
      model: {
        username: null,
        imageUrl: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },

    ProfilesList: {
      model: {
        userFound: null,
        list: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },
  },
})

@Injectable()
export class SearchState{
  [x: string]: any;
  constructor(
    private readonly store: Store,
  ) { }

  @Selector()
  static profilesList(state: SearchStateModel) {
    return state.ProfilesList;
  }

  @Action(SetProfilesList)
  async setProfilesLIst(
    ctx: StateContext<SearchStateModel>) {

    const rqst: SearchRequest = {
      username: this.store.selectSnapshot(SearchState).username,
    };
    
    const listOfProfiles = await this.SearchApi.search$(rqst);

    const arrOfProfiles: MinimizedProfile[] = [];

    listOfProfiles.data.list?.forEach((profile) => {
      arrOfProfiles.push({
        username: profile.username,
        imageURL: profile.imageURL,
      });
    });

    console.table(arrOfProfiles);

    ctx.setState(
      produce((draft) => {
        draft.ProfilesList = {
          model: {
            userFound: true,
            list: arrOfProfiles,
          },
          dirty: false,
          status: '',
          errors: {},
        }
      }));

  }

}