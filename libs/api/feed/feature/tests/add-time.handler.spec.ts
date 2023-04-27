/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { AddTimeCommand, AddTimeResponse, Status } from '@mp/api/feed/util';
import { FeedRepository } from '@mp/api/feed/data-access';
import { AddTimeHandler } from '../src/commands/';
import { AddTimeRequest } from '../../util/src/requests/add-time.request';

describe('Test for the add-posts\' handler:', () => {
  let addTimeHandler: AddTimeHandler;
  let feedRepository: FeedRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AddTimeHandler,
        {
          provide: FeedRepository,
          useValue: {
            addTime: jest.fn(),
          },
        },
      ],
    }).compile();

    addTimeHandler = moduleRef.get<AddTimeHandler>(AddTimeHandler);
    feedRepository = moduleRef.get<FeedRepository>(FeedRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(addTimeHandler).toBeDefined();
  });

  it('2. AddTimeResponse object, should be returned.', async () => {
    const request: AddTimeRequest = {
        modification: {
            postID: '1',
            time: 12345,
        },
    };
    const command = new AddTimeCommand(request);
    const mockStatus: Status = Status.SUCCESS;

    const expectedResult: AddTimeResponse = {
      status: mockStatus,
    };

    jest.spyOn(feedRepository, 'addTime').mockResolvedValue(mockStatus);

    const result = await addTimeHandler.execute(command);

    expect(feedRepository.addTime).toHaveBeenCalledWith(request.modification);
    expect(result).toEqual(expectedResult);
  });
});
