import { IProfile } from '@mp/api/profiles/util';

export class Logout {
  static readonly type = '[Profile] Logout';
}

export class SubscribeToProfile {
  static readonly type = '[Profile] SubscribeToProfile';
}

export class SetProfile {
  static readonly type = '[Profile] SetProfile';
  // constructor(public readonly profile: IProfile | null) {}
}

export class UpdateAccountDetails {
  static readonly type = '[Profile] UpdateAccountDetails';
}

export class UpdateAddressDetails {
  static readonly type = '[Profile] UpdateAddressDetails';
}

export class UpdateContactDetails {
  static readonly type = '[Profile] UpdateContactDetails';
}

export class UpdateOccupationDetails {
  static readonly type = '[Profile] UpdateOccupationDetails';
}

export class UpdatePersonalDetails {
  static readonly type = '[Profile] UpdatePersonalDetails';
}

export class SetPosts {
  static readonly type = '[Profile] SetPosts';
  // constructor(public readonly profile: IProfile | null) {}
}

export class UpdateProfilePicture {
  static readonly type = '[Profile] UpdateProfilePicture';
  constructor(public readonly imageURL: string | null) {}
}