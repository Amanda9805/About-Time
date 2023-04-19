import { MinimizedProfile } from '@mp/api/search/util';
import { ProfilesList } from '@mp/api/search/util';

export class SetMinimizedProfile {
  static readonly type = '[Search] SetMinimizedProfile';
  constructor(public readonly error: string | null) { }
}

export class SetProfilesList {
  static readonly type = '[Search] SetProfilesList';
  constructor(public readonly message: string | null) { }
}

