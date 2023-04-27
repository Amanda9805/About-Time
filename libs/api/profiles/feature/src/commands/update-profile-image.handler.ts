import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { UpdateProfileImageCommand, ProfileImageUpdateResponse } from '@mp/api/profiles/util';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import { Status } from '@mp/api/profiles/util';

@CommandHandler(UpdateProfileImageCommand)
export class UpdateProfileImageHandler implements ICommandHandler<UpdateProfileImageCommand, ProfileImageUpdateResponse> {
    constructor(
        private readonly repository: ProfilesRepository
    ) {}

    async execute(command: UpdateProfileImageCommand) {
        
        const request = command.request;
    
        const status = await this.repository.updateProfileImage(request.update);

        const responseData : Status = status;
        const response : ProfileImageUpdateResponse = {status: responseData};
        
        return response;
    }
}