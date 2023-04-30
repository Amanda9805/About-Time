import { Component } from '@angular/core';
import { IBadge, IMeter, IProfile, RelationEnum } from '@mp/api/profiles/util';
import { OtherUserState } from '@mp/app/other-user/data-access';
import { AuthState } from '@mp/app/auth/data-access';
import { SetOtherProfile, SetPosts, SetRelation, UpdateRelation } from '@mp/app/other-user/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'mp-other-user-page',
  templateUrl: './other-user.page.html',
  styleUrls: ['./other-user.page.scss']
})
export class OtherUserPage {
  // For the state
  @Select(OtherUserState.profile) profile$!: Observable<OtherUserState | null>;

  currentUser: any;

  constructor(
    private store: Store
  ) { }

  private = true;
  friends = true;
  deus = true;
  dead = false;
  hasPosts = false;
  hours = 0;
  minutes = 0;
  seconds = 0;

  user: any = {
    name: 'Jon Snow',
    pfp: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    bio: 'I know nothing',
    location: 'The wall',
    status: 'Deus',
    time: '10:50:10',
    friends: true,
    private: true
  }

  posts: any[] = [
    {
      caption: 'I know nothing',
      imagePath: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      caption: 'I know nothing',
      imagePath: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      caption: 'I know nothing',
      imagePath: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      caption: 'I know nothing',
      imagePath: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      caption: 'I know nothing',
      imagePath: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
  ];

  ngOnInit() {

    // Get the profile from the state
    this.store.select(OtherUserState.profile).subscribe((profile) => {
      // Get the info for the user
      this.user.name = profile?.accountDetails?.userName;
      this.user.pfp = profile?.accountDetails?.photoURL;
      this.user.title = profile?.accountDetails?.title;
      this.user.time = profile?.time;

      // Determine the title/status
      if (profile?.time === 0) {
        this.user.title = 'Dead';
      }
      else if (this.user.time < 24 * 3600) {
        this.user.title = 'Normal';
      }
      else {
        this.user.title = 'Deus';
      }

      // Determine privacy
      if (profile?.accountDetails?.private) {
        this.private = true;
      }
      else {
        this.private = false;
      }

      this.setTime();
    })

    this.store.dispatch(new SetPosts());
    // Get the user's posts from the state
    this.store.select(OtherUserState.posts).subscribe((posts) => {
      if (posts?.list?.length! > 0) {
        this.hasPosts = true;
      }
      this.posts = posts?.list?.map((post) => {
        return { caption: post.title, imagePath: post.image }
      })!;
    })
  }


  setTime() {
    this.hours = Math.floor(this.user.time / 3600);
    this.minutes = Math.floor((this.user.time % 3600) / 60);
    this.seconds = Math.floor(this.user.time % 60);
  }



  // Test to see
  ngAfterViewInit() {

    // Get the profile from the state
    this.store.select(OtherUserState.profile).subscribe((profile) => {
      // Get the info for the user
      this.user.name = profile?.accountDetails?.userName;
      this.user.pfp = profile?.accountDetails?.photoURL;
      this.user.title = profile?.accountDetails?.title;
      this.user.time = profile?.time!;

      // Determine the title/status
      if (profile?.time === 0) {
        this.user.title = 'Dead';
      }
      else if (this.user.time < 24 * 3600) {
        this.user.title = 'Normal';
      }
      else {
        this.user.title = 'Deus';
      }

      // Determine privacy
      if (profile?.accountDetails?.private) {
        this.private = true;
      }
      else {
        this.private = false;
      }

      this.setTime();
    })

    // Get the user's posts from the state
    this.store.select(OtherUserState.posts).subscribe((posts) => {
      if (posts?.list?.length! > 0) {
        this.hasPosts = true;
      }
      this.posts = posts?.list?.map((post) => {
        return { caption: post.title, imagePath: post.image }
      })!;
    })
  }
}
