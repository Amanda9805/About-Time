import { Component } from '@angular/core';
import { IBadge, IMeter, IProfile } from '@mp/api/profiles/util';
import { ProfileState } from '@mp/app/profile/data-access';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OtherUserUIModule } from '@mp/app/other-user/ui';

@Component({
  selector: 'ms-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  @Select(ProfileState.profile) profile$!: Observable<IProfile | null>;

  constructor(
    private store: Store
  ) { }

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

  badges: IBadge[] = [
    {
      name: 'Rockstar',
      iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      name: 'Einstein',
      iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      name: 'Ramsy',
      iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      name: 'Rockstar',
      iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      name: 'Einstein',
      iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
    {
      name: 'Ramsy',
      iconURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    },
  ]

  meters: IMeter[] = [
    {
      discipline: 'Science',
      time_accumulated: 60,
    },
    {
      discipline: 'Music',
      time_accumulated: 70,
    },
    {
      discipline: 'Food',
      time_accumulated: 50,
    },
  ]

  NgOnInit() {
    // Get the profile from the state
    this.store.select(ProfileState.profile).subscribe((profile) => {

      // Get the info for the user
      this.user.name = profile?.accountDetails?.userName!;
      this.user.pfp = profile?.accountDetails?.photoURL!;
      this.user.title = profile?.accountDetails?.title!;
      this.user.time = profile?.accountDetails?.time!;
      this.badges = profile?.accountDetails?.badges!;
      this.meters = profile?.accountDetails?.meters!;
    })

    // Get the user's posts from the state
    this.store.select(ProfileState.posts).subscribe((posts) => {
      this.posts = posts?.list?.map((post) => {
        return {caption: post.title, imagePath: post.image}
      })!;
    })
  }


}
