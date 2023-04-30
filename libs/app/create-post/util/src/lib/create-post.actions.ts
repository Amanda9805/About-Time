import { NewPost } from '@mp/api/createpost/util';

export class CreatePost {
  static readonly type = '[Post] Create Post';
  constructor(public readonly post: NewPost, public readonly file: File) { }
}

export class CreatePostSuccess {
  static readonly type = '[Post] Create Post Success';
  constructor(public readonly postId: number) { }
}

export class CreatePostFailure {
  static readonly type = '[Post] Create Post Failure';
  constructor(public readonly error: string) { }
}
