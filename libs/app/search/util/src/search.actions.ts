export class SetMinimizedProfile {
  static readonly type = '[Search] SetMinimizedProfile';
  constructor(public readonly error: string | null) { }
}

export class SetProfilesList {
  static readonly type = '[Search] SetProfilesList';
  constructor(public payload : {username : string}) { }
}

