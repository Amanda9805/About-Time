/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component} from '@angular/core';
import { IBadge, IMeter, IProfile } from '@mp/api/profiles/util';
import { ProfileState } from '@mp/app/profile/data-access';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetPosts, SetProfile } from '../../util/src/profile.actions';

@Component({
  selector: 'ms-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  @Select(ProfileState.profile) profile$!: Observable<IProfile | null>;

  constructor(
    private store: Store
  ) {

   }

  // MOCK DATA
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

  hasPosts: boolean = false;
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

  // badges: IBadge[] = [
  //   {
  //     name: 'Rockstar',
  //     iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  //   },
  //   {
  //     name: 'Einstein',
  //     iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  //   },
  //   {
  //     name: 'Ramsy',
  //     iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  //   },
  //   {
  //     name: 'Rockstar',
  //     iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  //   },
  //   {
  //     name: 'Einstein',
  //     iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  //   },
  //   {
  //     name: 'Ramsy',
  //     iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  //   },
  // ]

  // meters: IMeter[] = [
  //   {
  //     discipline: 'Science',
  //     time_accumulated: 60,
  //   },
  //   {
  //     discipline: 'Music',
  //     time_accumulated: 70,
  //   },
  //   {
  //     discipline: 'Food',
  //     time_accumulated: 50,
  //   },
  // ]

  ngOnInit() {
    console.log('Profile page loaded');

    this.store.dispatch(new SetProfile());
    console.log('Profile = set!');

    // Get the profile from the state
    this.store.select(ProfileState.profile).subscribe((profile) => {
      // const profile = profileObj?.model;

      // Get the info for the user
      this.user.name = profile?.accountDetails?.userName;
      this.user.pfp = profile?.accountDetails?.photoURL;
      this.user.title = profile?.accountDetails?.title;
      this.user.time = profile?.time;

      // Determine the title/status
      if (profile?.time === 0)
      {
        this.user.title = 'Dead';
      }
      else if (this.user.time < 24*3600) 
      {
        this.user.title = 'Normal';
      }
      else
      {
        this.user.title = 'Deus';
      }
      // this.badges = profile?.accountDetails?.badgesReceived!;
      // this.meters = profile?.accountDetails?.meters!;
    })


    this.store.dispatch(new SetPosts());
    // Get the user's posts from the state
    this.store.select(ProfileState.posts).subscribe((posts) => {
      if (posts?.list?.length! > 0) {
        this.hasPosts = true;
      }
      this.posts = posts?.list?.map((post) => {
        return {caption: post.title, imagePath: post.image}
      })!;
    })
  }


}
