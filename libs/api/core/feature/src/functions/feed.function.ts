import { FeedService } from '@mp/api/feed/feature';
import { NestFactory } from '@nestjs/core';
import * as functions from 'firebase-functions';
import { CoreModule } from '../core.module';
import {
  AddTimeRequest, AddTimeResponse, FetchPostsRequest, FetchPostsResponse,
  GetUserTimeRequest, GetUserTimeResponse, ModifyUserTimeRequest, ModifyUserTimeResponse
} from '@mp/api/feed/util';

export const fetchPosts = functions.https.onCall(
  async (
    request: FetchPostsRequest
  ): Promise<FetchPostsResponse> => {
    const app = await NestFactory.createApplicationContext(CoreModule);
    const service = app.get(FeedService, { strict: false });
    return service.fetchPosts(request);
  }
);

export const addTime = functions.https.onCall(
  async (
    request: AddTimeRequest
  ): Promise<AddTimeResponse> => {
    const app = await NestFactory.createApplicationContext(CoreModule);
    const service = app.get(FeedService, { strict: false });
    return service.addTime(request);
  }
);

export const getUserTime = functions.https.onCall(
  async (
    request: GetUserTimeRequest
  ): Promise<GetUserTimeResponse> => {
    console.log(request);
    const app = await NestFactory.createApplicationContext(CoreModule);
    const service = app.get(FeedService, { strict: false });
    return service.getUserTime(request);
  }
);

export const modifyUserTime = functions.https.onCall(
  async (
    request: ModifyUserTimeRequest
  ): Promise<ModifyUserTimeResponse> => {
    const app = await NestFactory.createApplicationContext(CoreModule);
    const service = app.get(FeedService, { strict: false });
    return service.modifyUserTime(request);
  }
);