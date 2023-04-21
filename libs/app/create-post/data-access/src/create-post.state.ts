import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreatePost, CreatePostSuccess, CreatePostFailure } from '@mp/app/create-post/util';
import { IUser } from '@mp/api/users/util';
import { Discipline } from '@mp/api/feed/util';
// import { PostService } from './post.service'; // Import the PostService from your application
import { CreatePostApi } from './create-post.api';
import { NewPost as INewPost, CreatePostRequest, CreatePostResponse } from '@mp/api/createpost/util';
import { Injectable } from '@angular/core';
import { AuthState } from '@mp/app/auth/data-access';

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
    console.log("boom boom boom");

    const { post, file } = action;

    const res = await this.postApi.uploadPicture(file, post);

    console.log("FINISHING HERE", res);

    return [];



    const postData: INewPost = {
      title: "title",
      description: "description",
      author: "author",
      content: "content",
      discipline: "ddd",
      image: "image"
    }

    const sendPost: CreatePostRequest = {
      post: postData
    }

    const response = await this.postApi.createPost(sendPost);

    // return await httpsCallable<CreatePostRequest, CreatePostResponse>(this.functions, 'createPost')(request);

    console.log("Post Created: ", response);

    return response;

    // Call the postService to create the post
    // return this.postService.createPost(post, file)
    //   .subscribe(
    //     (response: any) => {
    //       // Handle successful response from API
    //       const postId = response.id; // Update with the actual response property name
    //       ctx.dispatch(new CreatePostSuccess(postId));
    //     },
    //     (error: any) => {
    //       // Handle error from API
    //       ctx.dispatch(new CreatePostFailure(error.message));
    //     }
    //   );
  }

  // @Action(CreatePostSuccess)
  // createPostSuccess(ctx: StateContext<CreatePostStateModel>, action: CreatePostSuccess) {
  //   ctx.patchState({ postId: action.postId, error: null });
  // }

  // @Action(CreatePostFailure)
  // createPostFailure(ctx: StateContext<CreatePostStateModel>, action: CreatePostFailure) {
  //   ctx.patchState({ postId: null, error: action.error });
  // }
}
