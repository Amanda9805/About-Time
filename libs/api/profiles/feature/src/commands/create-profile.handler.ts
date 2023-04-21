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
  constructor(private publisher: EventPublisher) { }

  async execute(command: CreateProfileCommand) {
    console.log(`${CreateProfileHandler.name}`);

    const request = command.request;
    const userId = request.user.id;
    const userName = request.user.userName;
    const email = request.user.email;
    const photoURL = request.user.photoURL;
    const cellphone = request.user.phoneNumber;

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
      time: 1000
    };
    const profile = this.publisher.mergeObjectContext(Profile.fromData(data));

    profile.create();
    profile.commit();
  }
}
