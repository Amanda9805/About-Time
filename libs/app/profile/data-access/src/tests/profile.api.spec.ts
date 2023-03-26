import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesApi } from '../profiles.api';
import { Firestore } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import {
  IUpdateAccountDetailsRequest,
  IUpdateContactDetailsRequest,
  IUpdateAddressDetailsRequest,
  IUpdatePersonalDetailsRequest,
  IUpdateOccupationDetailsRequest
} from '@mp/api/profiles/util';

jest.mock('@angular/fire/firestore');
jest.mock('@angular/fire/functions');

describe('ProfilesApi', () => {
  let profilesApi: ProfilesApi;
  let firestore: jest.Mocked<Firestore>;
  let functions: jest.Mocked<Functions>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesApi,
        { provide: Firestore, useClass: Firestore },
        { provide: Functions, useClass: Functions }
      ],
    }).compile();

    profilesApi = module.get<ProfilesApi>(ProfilesApi);
    firestore = module.get(Firestore);
    functions = module.get(Functions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(profilesApi).toBeDefined();
  });
});
