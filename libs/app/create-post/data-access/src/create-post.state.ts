import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreatePost } from '@mp/app/create-post/util';
import { Discipline, Status } from '@mp/api/feed/util';
import { CreatePostApi } from './create-post.api';
import { Injectable } from '@angular/core';

export interface CreatePostStateModel {
  post: {
    model: {
      id: string | null;
      title: string | null;
      author: string | null;
      description: string | null;
      content: string | null;
      discipline: Discipline | null;
      image: string | null;
    };
    dirty: false;
    status: string;
    errors: object;
  }
}

@State<CreatePostStateModel>({
  name: 'createPost',
  defaults: {
    post: {
      model: {
        id: null,
        title: null,
        author: null,
        description: null,
        content: null,
        discipline: null,
        image: null
      },
      dirty: false,
      status: '',
      errors: {},
    }
  }
})

@Injectable()
export class CreatePostState {

  constructor(private postApi: CreatePostApi) { }

  @Selector()
  static post(state: CreatePostStateModel) {
    return state.post;
  }

  @Action(CreatePost)
  async createPost(ctx: StateContext<CreatePostStateModel>, action: CreatePost) {
    // const user = {"id": ctx.selectSnapshot(AuthState).user.uid};

    const { post, file } = action;

    const res = await this.postApi.uploadPicture(file, post);

    console.log("FINISHING HERE", res);

    return Status.SUCCESS;
  }
}
