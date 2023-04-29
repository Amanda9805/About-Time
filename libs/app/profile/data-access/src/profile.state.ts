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
} from '@mp/app/profile/util';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import produce from 'immer';
import { tap } from 'rxjs';
import { ProfilesApi } from './profiles.api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProfileStateModel {
  profile: IProfile | null;
  // profile: {
  //   model: {
  //     userId: string | null;
  //     accountDetails: {
  //       userName: string | null;
  //       email: string | null;
  //       photoURL: string | null;
  //       title: string | null;
  //       friends: string[] | null;
  //       friendsRequests: string[] | null;
  //       blockedUsers: string[] | null;
  //       meters: IMeter[] | null;
  //       badgesReceived: IBadge[] | null;
  //       private: boolean | null;
  //     };
  //     time: string | null;
  //   }
  //   dirty: false;
  //   status: string;
  //   errors: object;
  // }
  posts: IPostList | null;

  // Profile: {
  //   model: {

  //   }
  // }

  accountDetailsForm: {
    model: {
      userName: string | null;
      email: string | null;
      photoURL: string | null;
      password: string | null;
    };
    dirty: false;
    status: string;
    errors: object;
  };
}

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
    profile: null,
    // profile: {
    //   model: {
    //     userId: null,
    //     accountDetails: {
    //       userName: null,
    //       email: null,
    //       photoURL: null,
    //       title: null,
    //       friends: null,
    //       friendsRequests: null,
    //       blockedUsers: null,
    //       meters: null,
    //       badgesReceived: null,
    //       private:  null,
    //     },
    //     time: null,
    //   },
    //   dirty: false,
    //   status: '',
    //   errors: {},
    // },
    posts: null,
    accountDetailsForm: {
      model: {
        userName: null,
        email: null,
        photoURL: null,
        password: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },
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

  // @Action(SubscribeToProfile)
  // subscribeToProfile(ctx: StateContext<ProfileStateModel>) {
  //   const user = this.store.selectSnapshot(AuthState.user);
  //   if (!user) return ctx.dispatch(new SetError('User not set'));

  //   return this.profileApi
  //     .profile$(user.uid)
  //     .pipe(tap((profile: IProfile) => ctx.dispatch(new SetProfile(profile))));
  // }

  // @Action(SetProfile)
  // setProfile(ctx: StateContext<ProfileStateModel>, { profile }: SetProfile) {
  //   return ctx.setState(
  //     produce((draft) => {
  //       draft.profile = profile;
  //     })
  //   );
  // }

  @Action(SetProfile)
  async setProfile(ctx: StateContext<ProfileStateModel>) {
    // Get current user from AUTH state
    var user = {"id": this.store.selectSnapshot(AuthState).user.uid};

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


  // @Action(UpdateAccountDetails)
  // async updateAccountDetails(ctx: StateContext<ProfileStateModel>) {
  //   try {
  //     const state = ctx.getState();
  //     const userId = state.profile?.userId;
  //     const userName = state.accountDetailsForm.model.userName;
  //     const email = state.accountDetailsForm.model.email;
  //     // const photoURL = state.accountDetailsForm.model.photoURL;
  //     const password = state.accountDetailsForm.model.password;

  //     if (!userId || !userName || !email || !password)
  //       return ctx.dispatch(
  //         new SetError(
  //           'UserId or user name or email or photo URL or password not set'
  //         )
  //       );

  //     const request: IUpdateAccountDetailsRequest = {
  //       profile: {
  //         userId,
  //         accountDetails: {
  //           userName,
  //           email,
  //           password,
  //         },
  //       },
  //     };

  //     const responseRef = await this.profileApi.updateAccountDetails(request);
  //     const response = responseRef.data;
  //     return ctx.dispatch(new SetProfile(response.profile));
  //   } catch (error) {
  //     return ctx.dispatch(new SetError((error as Error).message));
  //   }
  // }
}
