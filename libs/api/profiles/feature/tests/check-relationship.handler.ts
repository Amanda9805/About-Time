/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Test } from "@nestjs/testing";
import { ProfilesRepository } from "@mp/api/profiles/data-access";
import { CheckRelationshipHandler } from "../src/commands";

describe('Test for checking relationship\' handler:', () => {
    let checkRelationshipHandler: CheckRelationshipHandler;
    let profilesRepository: ProfilesRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CheckRelationshipHandler,
                {
                    provide: ProfilesRepository,
                    useValue: {
                        checkRelationship: jest.fn(),
                    },
                },
            ],
        }).compile();

        checkRelationshipHandler = moduleRef.get<CheckRelationshipHandler>(CheckRelationshipHandler);
        // profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
    });

    it('1. Handler should be defined.', () => {
        expect(checkRelationshipHandler).toBeDefined();
    });

    /*it('2. ICheckRelationshipResponse object, should be returned', async() => {
        unsure of what to do here 
       const mockCurrentUser: IProfile = {
            userId: "1",
        };

        const mockOtherUser: IProfile = {
            userId: "2",
        };

        const 
    });*/
});