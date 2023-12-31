import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IPostList, IProfile, IUpdateRelationRequest, IRelation, RelationEnum, ICheckRelationshipRequest, FetchUserPostsRequest, IFetchProfileRequest } from '@mp/api/profiles/util';
import { SetError } from '@mp/app/errors/util';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import produce from 'immer';
import { OtherUserApi } from './other-user.api';
import { SetCurrentProfile, SetOtherProfile, SetPosts, SetRelation, UpdateRelation } from '@mp/app/other-user/util';
import { AuthState } from '@mp/app/auth/data-access';

export interface OtherUserStateModel {
  currentUser: IProfile | null;
  otherUser: IProfile | null;
  posts: IPostList | null;
  relation: IRelation | null;
  error: string | null;
}

@State<OtherUserStateModel>({
  name: 'OtherUser',
  defaults: {
    currentUser: null,
    otherUser: null,
    posts: null,
    relation: null,
    error: null,
  },
})
@Injectable()
export class OtherUserState {
  constructor(
    private readonly toastController: ToastController,
    private readonly store: Store,
    private readonly otherUserApi: OtherUserApi
  ) { }

  @Selector()
  static profile(state: OtherUserStateModel) {
    return state.otherUser;
  }

  @Selector()
  static posts(state: OtherUserStateModel) {
    return state.posts;
  }

  @Selector()
  static relation(state: OtherUserStateModel) {
    return state.relation;
  }

  @Action(UpdateRelation)
  async updateRelation(ctx: StateContext<OtherUserStateModel>, { relation }: UpdateRelation) {
    try {
      const state = ctx.getState();
      let relType;

      // Determine what the relation type is
      if (relation == "FRIEND") {
        relType = RelationEnum.FRIEND;
      }
      else if (relation == "BLOCKED") {
        relType = RelationEnum.BLOCKED;
      }
      else {
        relType = RelationEnum.NOTFRIEND;
      }

      const request: IUpdateRelationRequest = {
        newRelation: {
          userID: state.currentUser?.userId,
          otherUserID: state.otherUser?.userId,
          newRelationship: relType,
        }
      };

      // Call api function to update the relation
      const responseRef = await this.otherUserApi.updateRelation(request);
      const response = responseRef.data;
      return;

    } catch (error) {
      return ctx.dispatch(new SetError((error as Error).message));
    }
  }

  @Action(SetRelation)
  async setRelation(ctx: StateContext<OtherUserStateModel>) {
    // First call the api checkRelationship function
    const request: ICheckRelationshipRequest = {
      relationship: {
        currentUser: ctx.getState().currentUser,
        otherUser: ctx.getState().otherUser,
      }
    }

    const responseRef = await this.otherUserApi.checkRelationship(request);
    const response = responseRef.data;

    // then set the relation in the state
    return ctx.setState(
      produce((draft) => {
        draft.relation = response.relation;
      })
    );
  }

  @Action(SetPosts)
  async setPosts(ctx: StateContext<OtherUserStateModel>) {
    const request: FetchUserPostsRequest = {
      userProfile: ctx.getState().otherUser!,
    }
    console.log("SetPosts: Other user's profile", request.userProfile);

    // First call the api fetchUserPosts function
    const responseRef = await this.otherUserApi.fetchUserPosts(request);
    const response = responseRef.data;
    console.log("Set:Posts: Other user's posts:", response.posts);

    // then set the posts in the state
    return ctx.setState(
      produce((draft) => {
        draft.posts = response.posts;
      })
    );
  }


  @Action(SetError)
  async setError(ctx: StateContext<OtherUserStateModel>, { error }: SetError) {
    if (!error) return;

    ctx.setState(
      produce((draft) => {
        draft.error = error;
      })
    );

    const toast = await this.toastController.create({
      message: error,
      color: 'danger',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  @Action(SetOtherProfile)
  async setOtherProfile(ctx: StateContext<OtherUserStateModel>, { user }: SetOtherProfile) {

    // Create the request using the passed in user
    const request: IFetchProfileRequest = {
      user: user!,
    }

    // First call the api fetchUserPosts function
    const responseRef = await this.otherUserApi.fetchProfile(request);
    const response = responseRef.data;

    // Assign the retrieved data to the otherUser
    return ctx.setState(
      produce((draft) => {
        draft.otherUser = response.profile;
      })
    );
  }

  @Action(SetCurrentProfile)
  setCurrentProfile(ctx: StateContext<OtherUserStateModel>) {
    // Get current user from AUTH state
    const user = this.store.selectSnapshot(AuthState).user;

    return ctx.setState(
      produce((draft) => {
        draft.currentUser = user;
      })
    );
  }

}
