import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import produce from 'immer';
import {
  SetFilterList,
  SetPost,
  SetPostList,
  SetTimeModification,
  liveUpdatePostTime
} from '@mp/app/feed/util';
import { SetUserTimeModification } from '@mp/app/timer/util'
import {
  FilterList,
  Post,
  PostList,
  TimeModification,
  UserTime,
  Discipline,
  FilterType,
  FetchPostsRequest,
} from '@mp/api/feed/util';
import { FeedApi } from './feed.api';
import { SetError } from '@mp/app/errors/util';

export interface FeedStateModel {

  filterList: FilterList | null;
  postList: PostList | null;
  post: Post | null;
  timeModification: TimeModification | null;
  userTime: UserTime | null;

  Post: {
    model: {
      id: string | null;
      title: string | null;
      author: string | null;
      description: string | null;
      content: string | null;
      discipline: Discipline | null;
      time: number | null;
      image: string | undefined;
    };
    dirty: false;
    status: string;
    errors: object;
  };

  FilterList: {
    model: {
      list: FilterType[] | null;
    };
    dirty: false;
    status: string;
    errors: object;
  };

  PostList: {
    model: {
      postFound: boolean | null;
      list: Post[] | null;
    };
    dirty: false;
    status: string;
    errors: object;
  };

  TimeModification: {
    model: {
      postID: string | null;
      time: number | null;
    };
    dirty: false;
    status: string;
    errors: object;
  };

  UserTime: {
    model: {
      timeRemaining: boolean | null;
      timeAmount: number | null;
    };
    dirty: false;
    status: string;
    errors: object;
  };
}

@State<FeedStateModel>({
  name: 'feed',
  defaults: {
    filterList: null,
    postList: null,
    post: null,
    timeModification: null,
    userTime: null,

    Post: {
      model: {
        id: null,
        title: null,
        author: null,
        description: null,
        content: null,
        discipline: null,
        time: null,
        image: '',
      },

      dirty: false,
      status: '',
      errors: {},
    },

    FilterList: {
      model: {
        list: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },

    PostList: {
      model: {
        postFound: null,
        list: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },

    TimeModification: {
      model: {
        postID: null,
        time: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },

    UserTime: {
      model: {
        timeRemaining: null,
        timeAmount: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },
  },

})

@Injectable()
export class FeedState {
  constructor(
    private readonly feedApi: FeedApi,
    private readonly store: Store,
  ) { }

  @Selector()
  static postList(state: FeedStateModel) {
    return state.PostList;
  }

  @Selector()
  static post(state: FeedStateModel) {
    return state.Post;
  }

  @Selector()
  static userTime(state: FeedStateModel) {
    return state.UserTime;
  }

  @Action(SetFilterList)
  async setFilterList(
    ctx: StateContext<FeedStateModel>,
    { payload }: SetFilterList
  ) {
    try {
      ctx.setState(
        produce((draft) => {
          draft.filterList = {
            list: null,
          }
          draft.filterList.list = payload.list;
          draft.FilterList = { model: { list: payload.list }, dirty: false, status: '', errors: {} };
        }));

      ctx.dispatch(new SetPostList());
      return;
    } catch (error) {
      return ctx.dispatch(new SetError((error as Error).message));
    }
  }

  @Action(SetPostList)
  async setPostList(
    ctx: StateContext<FeedStateModel>) {

    const rqst: FetchPostsRequest = {
      filters: {
        list: this.store.selectSnapshot(FeedState).filterList?.list
      },
    };

    const listOfPosts = await this.feedApi.fetchPosts$(rqst);

    const arrOfPosts: Post[] = [];

    listOfPosts.data.posts.list?.forEach((post) => {
      arrOfPosts.push({
        id: post.id,
        title: post.title,
        author: post.author,
        description: post.description,
        content: post.content,
        discipline: post.discipline,
        time: post.time,
        image: post.image
      });
    });

    console.table(arrOfPosts);

    ctx.setState(
      produce((draft) => {
        draft.PostList = {
          model: {
            postFound: true,
            list: arrOfPosts,
          },
          dirty: false,
          status: '',
          errors: {},
        }
      }));

  }

  @Action(SetPost)
  async setPost(
    ctx: StateContext<FeedStateModel>,
    { payload }: SetPost
  ) {
    try {

      ctx.setState(
        produce((draft) => {
          draft.Post = { model: payload.post, dirty: false, status: '', errors: {} };
          draft.post = payload.post;
        }));

      return;
    } catch (error) {
      return ctx.dispatch(new SetError((error as Error).message));
    }
  }

  @Action(SetTimeModification)
  async setTimeModification(ctx: StateContext<FeedStateModel>, { payload }: SetTimeModification) {
    try {
      ctx.setState(
        produce((draft) => {
          draft.TimeModification = { model: { postID: payload.postID, time: payload.time }, dirty: false, status: '', errors: {} };
        }));

      const data = { postID: payload.postID, time: payload.time };

      // const addTimeRqst = { modification: this.store.selectSnapshot(FeedState).timeModification };
      const addTimeRqst = { modification: data };
      const rqstStatus = await this.feedApi.addTime$(addTimeRqst);
      const authorID = await this.store.selectSnapshot(FeedState).post.author;
      ctx.dispatch(new SetUserTimeModification({ time: payload.time, userID: authorID }));

      if (rqstStatus.data.status === 'success') {
        console.log('Time added successfully');
      } else {
        ctx.dispatch(new SetError('Time could not be added'));
      }
      return;

    } catch (error) {
      return ctx.dispatch(new SetError((error as Error).message));
    }
  }

  @Action(liveUpdatePostTime)
  async liveUpdatePostTime(ctx: StateContext<FeedStateModel>, { payload }: liveUpdatePostTime) {
    try {
      ctx.setState(
        produce((draft) => {
          draft.Post = { model: { ...draft.Post.model, time: payload.time }, dirty: false, status: '', errors: {} };
        }));
      return;
    } catch (error) {
      return ctx.dispatch(new SetError((error as Error).message));
    }
  }
}