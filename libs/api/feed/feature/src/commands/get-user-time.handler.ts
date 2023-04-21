import { FeedRepository } from '@mp/api/feed/data-access';
import { GetUserTimeResponse, GetUserTimeCommand, UserTime } from '@mp/api/feed/util';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(GetUserTimeCommand)
export class GetUserTimeHandler implements ICommandHandler<GetUserTimeCommand, GetUserTimeResponse> {
    constructor(
        private readonly repository: FeedRepository
    ) { }

    async execute(command: GetUserTimeCommand) {

        console.log(command.request);

        const request = command.request;

        const user = request.user;

        const userTime = await this.repository.getUserTime(user);

        console.log(userTime);

        const responseData: UserTime = { timeRemaining: userTime.timeRemaing, timeAmount: userTime.value };
        const response: GetUserTimeResponse = { "userTime": responseData };

        return response;
    }
}