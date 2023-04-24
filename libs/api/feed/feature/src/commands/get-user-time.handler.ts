import { FeedRepository } from '@mp/api/feed/data-access';
import { GetUserTimeResponse, GetUserTimeCommand, UserTime, Status } from '@mp/api/feed/util';
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

        if (userTime == Status.FAILURE) {
            const responseData: UserTime = { timeRemaining: false, timeAmount: -1 };
            const response: GetUserTimeResponse = { "userTime": responseData };
            return response;
        }

        const responseData: UserTime = { timeRemaining: userTime.timeRemaing, timeAmount: userTime.value };
        const response: GetUserTimeResponse = { "userTime": responseData };

        return response;
    }
}