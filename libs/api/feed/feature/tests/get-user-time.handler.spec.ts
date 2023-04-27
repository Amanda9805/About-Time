/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Test } from '@nestjs/testing';
import { GetUserTimeCommand, GetUserTimeResponse } from '@mp/api/feed/util';
import { FeedRepository } from '@mp/api/feed/data-access';
import { GetUserTimeHandler } from '../src/commands';
import { IUser } from '../../../users/util/src/interfaces/user.interface';
import { Timestamp } from 'firebase-admin/firestore';

import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

describe('Test for the get-user-time handler: ', () => {
  let getUserTimeHandler: GetUserTimeHandler;
  let feedRepository: FeedRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUserTimeHandler,
        {
          provide: FeedRepository,
          useValue: {
            getUserTime: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserTimeHandler = moduleRef.get<GetUserTimeHandler>(GetUserTimeHandler);
    feedRepository = moduleRef.get<FeedRepository>(FeedRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(getUserTimeHandler).toBeDefined();
  });

  it('2. GetUserTimeResponse object, should be returned.', async () => {
    const mockUser: IUser = {
      id: '1',
      email: 'test@example.com',
      userName: 'testUser',
      photoURL: 'https://example.com/photo.jpg',
      phoneNumber: '1234567890',
      customClaims: null,
      created: Timestamp.now(),
    };
    const mockUserTime = {
      timeRemaing: true,
      value: 1000,
    };
    const request = { user: mockUser };
    const command = new GetUserTimeCommand(request);

    const expectedResponse: GetUserTimeResponse = {
      userTime: {
        timeRemaining: mockUserTime.timeRemaing,
        timeAmount: mockUserTime.value,
      },
    };

    jest.spyOn(feedRepository, 'getUserTime').mockResolvedValue(mockUserTime);

    const result = await getUserTimeHandler.execute(command);

    expect(feedRepository.getUserTime).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(expectedResponse);
  });


});
