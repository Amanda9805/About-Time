/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { UpdatePrivacySettingsCommand, IUpdatePrivacySettingsResponse, IProfile, PrivacyStatus, Status } from '@mp/api/profiles/util';
import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { UpdatePrivacySettingsHandler } from '../src/commands/';
import { IUpdatePrivacySettingsRequest } from '../../util/src/requests/update-privacy-settings.request';

describe('Test for the fetch-profile\' handler:', () => {
  let updatePrivacySettingsHandler: UpdatePrivacySettingsHandler;
  let profilesRepository: ProfilesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdatePrivacySettingsHandler,
        {
          provide: ProfilesRepository,
          useValue: {
            updatePrivacySettings: jest.fn(),
          },
        },
      ],
    }).compile();

    updatePrivacySettingsHandler = moduleRef.get<UpdatePrivacySettingsHandler>(UpdatePrivacySettingsHandler);
    profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(UpdatePrivacySettingsHandler).toBeDefined();
  });

  it('2. FetchProfileResponse object, should be returned.', async () => {
    const request: IUpdatePrivacySettingsRequest = {
        privacySettings : {
            newStatus: PrivacyStatus.PRIVATE,
            profile:{
                userId : "test ID"
            }
        }
    };
    const command = new UpdatePrivacySettingsCommand(request);
    const mockStatus: Status = Status.SUCCESS;

    const expectedResult: IUpdatePrivacySettingsResponse = {
      status : mockStatus
    };

    jest.spyOn(profilesRepository, 'updatePrivacySettings').mockResolvedValue(mockStatus);

    const result = await updatePrivacySettingsHandler.execute(command);

    expect(profilesRepository.updatePrivacySettings).toHaveBeenCalledWith({
        userId : "test ID"
    }, PrivacyStatus.PRIVATE);
    expect(result).toEqual(expectedResult);
  });
});