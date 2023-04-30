/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { DeleteAccountCommand, IDeleteAccountResponse, IProfile, Status } from '@mp/api/profiles/util';
import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { DeleteAccountHandler } from '../src/commands/';
import { IDeleteAccountRequest } from '../../util/src/requests/delete-account.request';

describe('Test for the delete-account\' handler:', () => {
  let deleteAccountHandler: DeleteAccountHandler;
  let profilesRepository: ProfilesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteAccountHandler,
        {
          provide: ProfilesRepository,
          useValue: {
            deleteAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteAccountHandler = moduleRef.get<DeleteAccountHandler>(DeleteAccountHandler);
    profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(deleteAccountHandler).toBeDefined();
  });

  it('2. IDeleteAccountResponse object, should be returned.', async () => {
    const request: IDeleteAccountRequest = {
        deleteAccount : {
            userId: "test id"
        }
    };
    const command = new DeleteAccountCommand(request);
    const mockStatus: Status = Status.SUCCESS;

    const expectedResult: IDeleteAccountResponse = {
      status : mockStatus
    };

    jest.spyOn(profilesRepository, 'deleteAccount').mockResolvedValue(mockStatus);

    const result = await deleteAccountHandler.execute(command);

    expect(profilesRepository.deleteAccount).toHaveBeenCalledWith(request.deleteAccount);
    expect(result).toEqual(expectedResult);
  });
});
