export class SetUserTime {
  static readonly type = '[Feed] SetUserTime';
}

export class SetUserTimeModification{
  static readonly type = '[Feed] SetUserTimeModification';
  constructor(public payload: {time : number, userID : string}) {}
}

export class liveUpdateTime{
  static readonly type = '[Feed] liveUpdateTime';
  constructor(public payload: {time : number}) {}
}
