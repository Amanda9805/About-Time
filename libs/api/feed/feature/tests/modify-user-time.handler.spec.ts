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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ModifyUserTimeHandler,
        {
          provide: FeedRepository,
          useValue: {
            modifyUserTime: jest.fn(),
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
    const mockUser: IUser = {
      id: '1',
      email: 'test@example.com',
      userName: 'testUser',
      photoURL: 'https://example.com/photo.jpg',
      phoneNumber: '1234567890',
      customClaims: null,
      created: Timestamp.now(),
    };

    const mockModification = {
      userID: mockUser.id,
      postID: 'mockPostID',
      timeValue: 1000,
    };

    const request = { user: mockUser, modification: mockModification };
    const command = new ModifyUserTimeCommand(request);

    const expectedResponse: ModifyUserTimeResponse = {
      status: Status.SUCCESS,
    };

    jest.spyOn(feedRepository, 'modifyUserTime').mockResolvedValue(Status.SUCCESS);

    const result = await modifyUserTimeHandler.execute(command);

    expect(feedRepository.modifyUserTime).toHaveBeenCalledWith(mockModification);
    expect(result).toEqual(expectedResponse);
  });
});
