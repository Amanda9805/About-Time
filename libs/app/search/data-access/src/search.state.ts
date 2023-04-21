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
  constructor(
    private readonly store: Store,
    private readonly SearchApi: SearchApi,
  ) {}

  @Selector()
  static profilesList(state: SearchStateModel) {
    return state.ProfilesList;
  }

  @Action(SetProfilesList)
  async setProfilesList(
    ctx: StateContext<SearchStateModel>,
    {payload}: SetProfilesList
    ){

    const rqst: SearchRequest = {
      username: payload.username,
    };

    const listOfProfiles = await this.SearchApi.search$(rqst);

    const arrOfProfiles: MinimizedProfile[] = [];

    if(listOfProfiles.data.profiles?.userFound){
      listOfProfiles.data.profiles?.list?.forEach((profile) => {
        arrOfProfiles.push({
          username: profile.username,
          imageURL: profile.imageURL,
        });
      });
    }else{
      console.log("No user found");
    }


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
