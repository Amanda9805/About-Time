import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  SearchRequest,
  SearchResponse,
} from '@mp/api/search/util';

@Injectable()
export class SearchApi {
  constructor(
    private readonly firestore: Firestore,
    private readonly functions: Functions
  ) {}

  async search$(request: SearchRequest){
    return await httpsCallable<SearchRequest, SearchResponse>(
      this.functions,
      'search'
    )(request);
  }
}
