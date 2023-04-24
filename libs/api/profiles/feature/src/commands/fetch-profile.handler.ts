import { ProfilesRepository } from '@mp/api/profiles/data-access';
// import { FetchPostsResponse, FetchPostsCommand } from '@mp/api/feed/util';
import { FetchProfileCommand, IFetchProfileResponse, IProfile } from '@mp/api/profiles/util';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
// import { RelationEnum } from 'libs/api/profiles/util/src/enums/relations.enum';
// import { IRelation } from 'libs/api/profiles/util/src/interfaces/relation.interface';

// import { PostList } from '@mp/api/feed/util';

@CommandHandler(FetchProfileCommand)
export class FetchProfileHandler implements ICommandHandler<FetchProfileCommand, IFetchProfileResponse> {
    constructor(
        private readonly repository: ProfilesRepository
    ) {}
  
    async execute(command: FetchProfileCommand) {
      // For debugging
      console.log(`${FetchProfileHandler.name}`);

      // This object will contain the data sent by the request 
      const request = command.request;
      
      // Get the parameters from the request 
      const user = request.user

      // Call the function to get the data from the DB (need to pass in the list of filters to determine query to make)
      const fetchProfileDoc = await this.repository.fetchProfile(user);

      const responseData: IProfile = fetchProfileDoc;
    //   {"userId": fetchProfileDoc.userId,};

      const response : IFetchProfileResponse = {"profile": responseData};
      
      return response;
    }
  }
  