import { Injectable } from '@angular/core';
import {
  FetchUserPostsRequest,
  IBadge,
  IFetchProfileRequest,
  IMeter,
  IPostList,
  IProfile,
  IUpdateAccountDetailsRequest,
} from '@mp/api/profiles/util';
import { AuthState } from '@mp/app/auth/data-access';
import { Logout as AuthLogout } from '@mp/app/auth/util';
import { SetError } from '@mp/app/errors/util';
import {
  Logout,
  SetPosts,
  SetProfile,
  SubscribeToProfile,
  UpdateAccountDetails,
  UpdateProfilePicture,
  UpdateUsername,
} from '@mp/app/profile/util';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import produce from 'immer';
import { tap } from 'rxjs';
import { ProfilesApi } from './profiles.api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProfileStateModel {
  profile: IProfile | null;
  posts: IPostList | null;
}

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
    profile: null,
    posts: null,
  },
})
@Injectable()
export class ProfileState {
  constructor(
    private readonly profileApi: ProfilesApi,
    private readonly store: Store
  ) { }

  @Selector()
  static profile(state: ProfileStateModel) {
    return state.profile;
  }

  @Selector()
  static posts(state: ProfileStateModel) {
    return state.posts;
  }

  @Action(Logout)
  async logout(ctx: StateContext<ProfileStateModel>) {
    return ctx.dispatch(new AuthLogout());
  }

  @Action(SetProfile)
  async setProfile(ctx: StateContext<ProfileStateModel>) {
    // Get current user from AUTH state
    let user = { "id": this.store.selectSnapshot(AuthState).user.uid };

    // Create the request using the passed in user
    const request: IFetchProfileRequest = {
      user: user!,
    }
    console.log("request: ", request);

    // First call the api fetchProfilefunction
    const responseRef = await this.profileApi.fetchProfile(request);
    const response = responseRef.data;

    // Assign the returned data to the profile in the state
    return ctx.setState(
      produce((draft) => {
        draft.profile = response.profile;
      })
    );
  }



  @Action(SetPosts)
  async setPosts(ctx: StateContext<ProfileStateModel>) {
    const request: FetchUserPostsRequest = {
      userProfile: ctx.getState().profile!,
    }

    // First call the api fetchUserPosts function
    const responseRef = await this.profileApi.fetchUserPosts(request);
    const response = responseRef.data;

    // then set the posts in the state
    return ctx.setState(
      produce((draft) => {
        draft.posts = response.posts;
      })
    );
  }

  @Action(UpdateProfilePicture)
  async updateProfilePicture(ctx: StateContext<ProfileStateModel>, image: UpdateProfilePicture) {
    // Change the profile picture in the state profile
    return ctx.setState(
      produce((draft) => {
        if (draft.profile?.accountDetails)
          draft.profile.accountDetails.photoURL = image.imageURL;
      })
    );
  }

  @Action(UpdateUsername)
  async updateUsername(ctx: StateContext<ProfileStateModel>, username: UpdateUsername) {
    // Change the username in the state profile
    return ctx.setState(
      produce((draft) => {
        if (draft.profile?.accountDetails)
          draft.profile.accountDetails.userName = username.username;
      })
    );
  }
}