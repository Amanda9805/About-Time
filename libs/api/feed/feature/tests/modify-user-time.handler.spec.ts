/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Test } from '@nestjs/testing';
import { ModifyUserTimeCommand, ModifyUserTimeResponse, Status } from '@mp/api/feed/util';
import { FeedRepository } from '@mp/api/feed/data-access';
import { ModifyUserTimeHandler } from '../src/commands';
import { IUser } from '../../../users/util/src/interfaces/user.interface';
import { Timestamp } from 'firebase-admin/firestore';

describe('Test for the modify-user-time handler: ', () => {
  let modifyUserTimeHandler: ModifyUserTimeHandler;
  let feedRepository: FeedRepository;

  // Setup the testing environment before each test
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ModifyUserTimeHandler,
        {
          provide: FeedRepository,
          useValue: {
            modifyUserTime: jest.fn(), // Mock the modifyUserTime method located inside the FeedRepository
          },
        },
      ],
    }).compile();

    modifyUserTimeHandler = moduleRef.get<ModifyUserTimeHandler>(ModifyUserTimeHandler);
    feedRepository = moduleRef.get<FeedRepository>(FeedRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(modifyUserTimeHandler).toBeDefined();
  });

  it('2. ModifyUserTimeResponse object, should be returned.', async () => {
    // Create a mock user
    const mockUser: IUser = {
      id: '1',
      email: 'test@example.com',
      userName: 'testUser',
      photoURL: 'https://example.com/photo.jpg',
      phoneNumber: '1234567890',
      customClaims: null,
      created: Timestamp.now(),
    };

    // Create a mock modification object with the required properties
    const mockModification = {
      userID: mockUser.id,
      postID: 'mockPostID',
      timeValue: 1000,
    };

    // Create a mock modification object with the above objects this function requires
    const request = { user: mockUser, modification: mockModification };
    const command = new ModifyUserTimeCommand(request);

    // Define the expected response object
    const expectedResponse: ModifyUserTimeResponse = {
      status: Status.SUCCESS,
    };

    // Mock the response of the modifyUserTime method of the FeedRepository [ this was instructed to be mocked on line 22 ]
    jest.spyOn(feedRepository, 'modifyUserTime').mockResolvedValue(Status.SUCCESS);

    // Execute the handler with the command and store the result
    const result = await modifyUserTimeHandler.execute(command);

    // determine if the modifyUserTime method was called with the correct argument(s); else fail the test
    expect(feedRepository.modifyUserTime).toHaveBeenCalledWith(mockModification);

    // pass test if the result matches the expected response object; else fail the test
    expect(result).toEqual(expectedResponse);
  });
});
