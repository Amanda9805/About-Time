import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  AddTimeRequest,
  AddTimeResponse,
  FetchPostsRequest,
  FetchPostsResponse,
  GetUserTimeRequest,
  GetUserTimeResponse,
  ModifyUserTimeRequest,
  ModifyUserTimeResponse
} from '@mp/api/feed/util';

@Injectable()
export class FeedApi {
  constructor(
    private readonly functions: Functions
  ) { }

  async fetchPosts$(request: FetchPostsRequest) {
    return await httpsCallable<FetchPostsRequest, FetchPostsResponse>(
      this.functions,
      'fetchPosts'
    )(request);
  }

  async addTime$(request: AddTimeRequest) {
    return await httpsCallable<AddTimeRequest, AddTimeResponse>(
      this.functions,
      'addTime'
    )(request);
  }

  async getUserTime$(request: GetUserTimeRequest) {
    return await httpsCallable<GetUserTimeRequest, GetUserTimeResponse>(
      this.functions,
      'getUserTime'
    )(request);
  }

  async modifyUserTime$(request: ModifyUserTimeRequest) {
    return await httpsCallable<ModifyUserTimeRequest, ModifyUserTimeResponse>(
      this.functions,
      'modifyUserTime'
    )(request);
  }
}