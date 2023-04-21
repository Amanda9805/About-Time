import {
  CreateProfileCommand,
  IProfile,
  ProfileStatus
} from '@mp/api/profiles/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Timestamp } from 'firebase-admin/firestore';
import { Profile } from '../models';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>
{
  static ASSIGNED_MINUTES = 60; // User is assigned 1 hour of time
  constructor(private publisher: EventPublisher) { }

  async execute(command: CreateProfileCommand) {
    console.log(`${CreateProfileHandler.name}`);

    const request = command.request;
    const userId = request.user.id;
    const userName = request.user.userName;
    const email = request.user.email;
    const photoURL = request.user.photoURL;

    const data: IProfile = {
      userId,
      accountDetails: {
        userName,
        email,
        photoURL,
        status: ProfileStatus.INCOMPLETE,
      },
      status: ProfileStatus.INCOMPLETE,
      created: Timestamp.fromDate(new Date()),
      time: (CreateProfileHandler.ASSIGNED_MINUTES * 60 * 1000),
    };
    const profile = this.publisher.mergeObjectContext(Profile.fromData(data));

    profile.create();
    profile.commit();
  }
}
