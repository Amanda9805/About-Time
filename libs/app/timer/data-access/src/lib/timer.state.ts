import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import produce from 'immer';
import {
  SetUserTime,
  SetUserTimeModification,
  liveUpdateTime,
} from '@mp/app/timer/util';


import {
  ModifyUserTimeRequest,
  GetUserTimeRequest,
  UserTimeModification,
  UserTime,
} from '@mp/api/feed/util';

import { IUser } from '@mp/api/users/util';
import { AuthState } from '@mp/app/auth/data-access';
import { FeedApi } from '@mp/app/feed/data-access';
import { SetError } from '@mp/app/errors/util';

export interface TimerStateModel {

  userTime: UserTime | null;
  userTimeModification: UserTimeModification | null;

  UserTime: {
    model: {
      timeRemaining: boolean | null;
      timeAmount: number | null;
    };
    dirty: false;
    status: string;
    errors: object;
  };

  UserTimeModification: {
    model: {
      userID: string;
      timeValue: number;
    };
    dirty: false;
    status: string;
    errors: object;
  };
}

@State<TimerStateModel>({
  name: 'timer',
  defaults: {
    userTime: null,
    userTimeModification: null,

    UserTime: {
      model: {
        timeRemaining: false,
        timeAmount: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },

    UserTimeModification: {
      model: {
        userID: '',
        timeValue: 0,
      },
      dirty: false,
      status: '',
      errors: {},
    },
  },
})

@Injectable()
export class TimerState {
  constructor(
    private readonly feedApi: FeedApi,
    private readonly store: Store,
  ) { }

  @Selector()
  static userTime(state: TimerStateModel) {
    return state.UserTime;
  }

  @Action(SetUserTime)
  async setUserTime(ctx: StateContext<TimerStateModel>) {
    const userTimeRqst = {
      user: await this.store.selectSnapshot(AuthState).user.uid,
    }

    console.log(userTimeRqst);

    const userTime = await this.feedApi.getUserTime$(userTimeRqst);

    console.log('userTime: ', userTime);
    ctx.setState(
      await produce((draft) => {
        draft.userTime = {
          timeRemaining: userTime.data.userTime.timeRemaining,
          timeAmount: userTime.data.userTime.timeAmount,
        }
        draft.UserTime = {
          model: {
            timeRemaining: userTime.data.userTime.timeRemaining,
            timeAmount: userTime.data.userTime.timeAmount,
          }, dirty: false, status: '', errors: {}
        };
      })
    )
  }

  @Action(liveUpdateTime)
  async liveUpdateTime(ctx: StateContext<TimerStateModel>
    , { payload }: liveUpdateTime
    ) {
    ctx.setState(
      await produce((draft) => {
        draft.userTime = {
          timeRemaining: true,
          timeAmount: payload.time,
        }
        draft.UserTime = {
          model: {
            timeRemaining: true,
            timeAmount: payload.time,
          }, dirty: false, status: '', errors: {}
        };
      })
    )
  }


  @Action(SetUserTimeModification)
  async setUserTimeModification(ctx: StateContext<TimerStateModel>, { payload }: SetUserTimeModification) {

    const userTimeModificationRqst = {
      modification: {
        userID: payload.userID,
        timeValue: payload.time,
      }
    }

    const userTimeModification = await this.feedApi.modifyUserTime$(userTimeModificationRqst);
    console.log('userTimeModification: ', userTimeModification);
    if (userTimeModification.data.status) {
      console.log('UserTime updated');
      ctx.dispatch(new SetUserTime());
    } else {
      ctx.dispatch(new SetError('UserTime not updated'));
    }

  }
}
