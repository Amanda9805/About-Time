import { Component } from '@angular/core';
import { IBadge, IMeter, IProfile, RelationEnum } from '@mp/api/profiles/util';
import { OtherUserState } from '@mp/app/other-user/data-access';
import { AuthState } from '@mp/app/auth/data-access';
import { SetOtherProfile, SetRelation, UpdateRelation } from '@mp/app/other-user/util';
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

  private: boolean = true;
  friends: boolean = true;
  deus: boolean = true;
  dead: boolean = false;

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
    // Set the profile in the state -- passed in mock data
    this.store.dispatch(new SetOtherProfile({id: '1'}));

    // Determine the relation between the users
    this.store.dispatch(new SetRelation());

    // Get the profile from the state
    this.store.select(OtherUserState.profile).subscribe((profile) => {
      // Get the info for the user
      this.user.name = profile?.accountDetails?.userName!;
      this.user.pfp = profile?.accountDetails?.photoURL!;
      this.user.title = profile?.accountDetails?.title!;
      this.user.time = profile?.time!;

      // Added:
      this.badges = profile?.accountDetails?.badgesReceived!;
      this.meters = profile?.accountDetails?.meters!;

      // Determine privacy
      if (profile?.accountDetails?.private) {
        this.private = true;
      }
      else
      {
        this.private = false;
      }
    })

    // Get the relation from the state and determine if the users are friends
    this.store.select(OtherUserState.relation).subscribe((relation) => {
      if (relation?.type === RelationEnum.FRIEND) {
        this.friends = true;
      }
      else
      {
        this.friends == false;
      }
    })

    // Get the user's posts from the state
    this.store.select(OtherUserState.posts).subscribe((posts) => {
      this.posts = posts?.list?.map((post) => {
        return {caption: post.title, imagePath: post.image}
      })!;
    })
  }

  manageFriend(newRelation: string) {
    this.store.dispatch(new UpdateRelation(newRelation));
  }

}
