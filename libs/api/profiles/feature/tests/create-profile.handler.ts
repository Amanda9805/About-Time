/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Test } from '@nestjs/testing';
import { Status, CreateProfileCommand } from '@mp/api/profiles/util';
import { Timestamp } from 'firebase-admin/firestore';
import { CreateProfileHandler } from '../src/commands';
import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { CreateProfileResponse } from '@mp/api/profiles/util';
import { IUser } from '../../../users/util/src/interfaces/user.interface';

describe('Test for create-profile\' handler:', () => {
    let createProfileHandler: CreateProfileHandler;
    let profilesRepository: ProfilesRepository;

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateProfileHandler,
                {
                    provide: ProfilesRepository,
                    useValue: {
                        createProfile: jest.fn(),
                    },
                },
            ],
        }).compile();

        createProfileHandler = moduleRef.get<CreateProfileHandler>(CreateProfileHandler);
        profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
    });

    it('1. Handler should be defined.', () => {
        expect(createProfileHandler).toBeDefined();
    });

    it('2. CreatProfile object, should be returned.', async () => {
        const request: IUser = {
            id: '1',
            email: 'test@example.com',
            userName: 'testUser',
            photoURL: 'https://example.com/photo.jpg',
            phoneNumber: '1234567890',
            customClaims: null,
            created: Timestamp.now(),
        }

        const command = new CreateProfileCommand(request);
        const mockStatus: Status = Status.SUCCESS;

        const expectedResult: CreateProfileResponse = {
            status: mockStatus,
        };

        jest.spyOn(profilesRepository, 'createProfile').mockResolvedValue(mockStatus);
        
        const result = await createProfileHandler.execute(command);

        expect(profilesRepository.createProfile).toHaveBeenCalledWith(request);
        expect(result).toEqual(expectedResult);
    });
});