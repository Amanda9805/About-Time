import { ProfilesModule as ProfilesDataAccessModule } from '@mp/api/profiles/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateProfileHandler,
  FetchProfileHandler,
  UpdateAccountDetailsHandler,
  UpdateProfileStatusHandler,
} from './commands';
import {
  AccountDetailsUpdatedHandler,
  ProfileCreatedHandler,
  ProfileStatusUpdatedHandler
} from './events';
import { ProfilesSagas } from './profiles.sagas';
import { ProfilesService } from './profiles.service';
import { FetchUserPostsHandler } from './commands/fetch-user-posts.handler';
import { UpdateRelationHandler } from './commands/update-relation.handler';
import { UpdateProfileImageHandler } from './commands/update-profile-image.handler';
export const CommandHandlers = [
  CreateProfileHandler,
  UpdateAccountDetailsHandler,
  UpdateProfileStatusHandler,
  FetchProfileHandler,
  FetchUserPostsHandler,
  UpdateRelationHandler,
  UpdateProfileImageHandler
];
export const EventHandlers = [
  ProfileCreatedHandler,
  AccountDetailsUpdatedHandler,
  ProfileStatusUpdatedHandler,
  FetchProfileHandler,
  FetchUserPostsHandler,
  UpdateRelationHandler
];

@Module({
  imports: [CqrsModule, ProfilesDataAccessModule],
  providers: [
    ProfilesService,
    ...CommandHandlers,
    ...EventHandlers,
    ProfilesSagas,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule { }
