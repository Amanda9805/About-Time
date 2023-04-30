/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { UpdateProfileImageCommand, ProfileImageUpdateResponse, IProfile, Status } from '@mp/api/profiles/util';
import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { UpdateProfileImageHandler } from '../src/commands/';
import { ProfileImageUpdateRequest } from '../../util/src/requests/update-profile-image.request';

describe('Test for the update-profile-image\' handler:', () => {
  let updateProfileImageHandler: UpdateProfileImageHandler;
  let profilesRepository: ProfilesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateProfileImageHandler,
        {
          provide: ProfilesRepository,
          useValue: {
            updateProfileImage: jest.fn(),
          },
        },
      ],
    }).compile();

    updateProfileImageHandler = moduleRef.get<UpdateProfileImageHandler>(UpdateProfileImageHandler);
    profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(UpdateProfileImageHandler).toBeDefined();
  });

  it('2. ProfileImageUpdateResponse object, should be returned.', async () => {
    const request: ProfileImageUpdateRequest = {
        update : {
            userId: "test id",
            newImageURL: "newurl"
        }
    };
    const command = new UpdateProfileImageCommand(request);
    const mockStatus: Status = Status.SUCCESS;

    const expectedResult: ProfileImageUpdateResponse = {
      status: mockStatus
    };

    jest.spyOn(profilesRepository, 'updateProfileImage').mockResolvedValue(mockStatus);

    const result = await updateProfileImageHandler.execute(command);

    expect(profilesRepository.updateProfileImage).toHaveBeenCalledWith(request.update);
    expect(result).toEqual(expectedResult);
  });
});