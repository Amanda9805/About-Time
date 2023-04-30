import { CreatePostService } from '@mp/api/createpost/feature'
import {
    CreatePostRequest as ICreatePostRequest, CreatePostResponse as ICreatePostResponse
} from '@mp/api/createpost/util'
import { NestFactory } from '@nestjs/core'
import * as functions from 'firebase-functions';
import { CoreModule } from '../core.module';

export const createPost = functions.https.onCall(
    async (request: ICreatePostRequest): Promise<ICreatePostResponse> => {
        const app = await NestFactory.createApplicationContext(CoreModule);
        const service = app.get(CreatePostService);
        return service.createPost(request);
    }
)