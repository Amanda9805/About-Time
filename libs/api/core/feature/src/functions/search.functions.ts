import { SearchService } from '@mp/api/search/feature';
import { NestFactory } from '@nestjs/core';
import * as functions from 'firebase-functions';
import { CoreModule } from '../core.module';
import { SearchRequest, SearchResponse } from '@mp/api/search/util';

export const search = functions.https.onCall(
    async (request: SearchRequest): Promise<SearchResponse> => {
        const app = await NestFactory.createApplicationContext(CoreModule);
        const service = app.get(SearchService, { strict: false });
        return service.search(request);
    }
)