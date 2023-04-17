import { ProfilesRepository } from '@mp/api/profiles/data-access';
// import { FetchPostsResponse, FetchPostsCommand } from '@mp/api/feed/util';
import { CheckRelationshipCommand, ICheckRelationshipResponse } from '@mp/api/profiles/util';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import { RelationEnum } from 'libs/api/profiles/util/src/enums/relations.enum';
import { IRelation } from 'libs/api/profiles/util/src/interfaces/relation.interface';
// import { PostList } from '@mp/api/feed/util';

@CommandHandler(CheckRelationshipCommand)
export class CheckRelationshipHandler implements ICommandHandler<CheckRelationshipCommand, ICheckRelationshipResponse> {
    constructor(
        private readonly repository: ProfilesRepository
    ) {}

    async execute(command: CheckRelationshipCommand) {
        // For debugging
        console.log(`${CheckRelationshipHandler.name}`);

        // This object will contain the data sent by the request (whose interface you have already defined)
        const request = command.request;
        
        // Get the parameters from the request (in this case the filters)
        const relationship = request.relationship

        // Call the function to get the data from the DB (need to pass in the list of filters to determine query to make)
        const checkRelationshipDoc = await this.repository.checkRelationship(relationship);

        const responseData: IRelation = {"exists": checkRelationshipDoc.exists, "type": checkRelationshipDoc.type as RelationEnum};

        const response : ICheckRelationshipResponse = {"relation" : responseData};
        
        return response;
    }
}