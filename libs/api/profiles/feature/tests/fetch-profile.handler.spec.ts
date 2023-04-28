/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { FetchProfileCommand, IFetchProfileResponse, IProfile } from '@mp/api/profiles/util';
import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { FetchProfileHandler } from '../src/commands/';
import { IFetchProfileRequest } from '../../util/src/requests/fetch-profile.request';

describe('Test for the fetch-profile\' handler:', () => {
  let fetchProfileHandler: FetchProfileHandler;
  let profilesRepository: ProfilesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FetchProfileHandler,
        {
          provide: ProfilesRepository,
          useValue: {
            fetchProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    fetchProfileHandler = moduleRef.get<FetchProfileHandler>(FetchProfileHandler);
    profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(fetchProfileHandler).toBeDefined();
  });

  it('2. FetchProfileResponse object, should be returned.', async () => {
    const request: IFetchProfileRequest = {
        user : {
            id: "test id"
        }
    };
    const command = new FetchProfileCommand(request);
    const mockProfile: IProfile = {"userId":"test id"};

    const expectedResult: IFetchProfileResponse = {
      profile: {
        userId : "test id"
      },
    };

    jest.spyOn(profilesRepository, 'fetchProfile').mockResolvedValue(mockProfile);

    const result = await fetchProfileHandler.execute(command);

    expect(profilesRepository.fetchProfile).toHaveBeenCalledWith(request.user);
    expect(result).toEqual(expectedResult);
  });
});
