import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import produce from 'immer';
import {
  SetUserTime,
  SetUserTimeModification,
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
      timeRemaining : boolean | null;
      timeAmount : number | null;
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
    ) {}

  @Selector()
  static userTime(state: TimerStateModel) {
    return state.UserTime;
  }

  @Action(SetUserTime)
  async setUserTime(ctx: StateContext<TimerStateModel>){
    const userTimeRqst = {
      user : this.store.selectSnapshot(AuthState).user,
    }

//    const userTime = await this.feedApi.getUserTime$(userTimeRqst);
//comment out below and uncomment above to test with real data
    const userTime = {
          data: {
            userTime: {
              timeRemaining: true,
              timeAmount: 52345,
            }
          }
        }

    console.log('userTime: ', userTime);
    ctx.setState(
      produce((draft) => {
        draft.userTime = {
          timeRemaining: userTime.data.userTime.timeRemaining,
          timeAmount: userTime.data.userTime.timeAmount,
        }
        draft.UserTime = {model : {
          timeRemaining: userTime.data.userTime.timeRemaining,
          timeAmount: userTime.data.userTime.timeAmount,
        }, dirty : false, status : '', errors : {}};
      })
    )
  }

  @Action(SetUserTimeModification)
  async setUserTimeModification(ctx: StateContext<TimerStateModel>,
    {payload} : SetUserTimeModification,
    ){
    const userTimeModificationRqst = {
      modification: {
      userID : this.store.selectSnapshot(AuthState).user.userID,
      timeValue: payload.time,
      }
    }

    const userTimeModification = await this.feedApi.modifyUserTime$(userTimeModificationRqst);
    console.log('userTimeModification: ', userTimeModification);
    if(userTimeModification.data.status){
      console.log('UserTime updated');
    }else{
      ctx.dispatch(new SetError('UserTime not updated'));
    }

    ctx.dispatch(new SetUserTime());
  }
}
