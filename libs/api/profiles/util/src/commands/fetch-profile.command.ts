import { IFetchProfileRequest } from '../requests';

export class FetchProfileCommand {
  constructor(public readonly request: IFetchProfileRequest) {}
}
