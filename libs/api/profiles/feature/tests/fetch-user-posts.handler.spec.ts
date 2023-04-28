/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { FetchUserPostsCommand, IFetchUserPostsResponse, IPostList } from '@mp/api/profiles/util';
import { ProfilesRepository } from '@mp/api/profiles/data-access';
import { FetchUserPostsHandler } from '../src/commands/';
import { FetchUserPostsRequest } from '../../util/src/requests/fetch-user-posts.request';
import {Discipline} from '@mp/api/feed/util';

describe('Test for the add-posts\' handler:', () => {
  let fetchUserPostsHandler: FetchUserPostsHandler;
  let profilesRepository: ProfilesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FetchUserPostsHandler,
        {
          provide: ProfilesRepository,
          useValue: {
            fetchUserPosts: jest.fn(),
          },
        },
      ],
    }).compile();

    fetchUserPostsHandler = moduleRef.get<FetchUserPostsHandler>(FetchUserPostsHandler);
    profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(fetchUserPostsHandler).toBeDefined();
  });

  it('2. FetchUserPostsResponse object, should be returned.', async () => {
    const request: FetchUserPostsRequest = {
        userProfile: {
            userId: 'test id',
        },
    };
    const command = new FetchUserPostsCommand(request);
    const mockPostsList = { 
        postsFound : true,
        list : [{
            id : "id",
            title : "title",
            author : "author",
            description : "desc",
            content : "content",
            discipline : Discipline.SCIENCE,
            time : 100,
            image : "imageurl",
        }],
      };

    const expectedResult: IFetchUserPostsResponse = {
      posts: {
        postsFound : true,
        list : [{
            id : "id",
            title : "title",
            author : "author",
            description : "desc",
            content : "content",
            discipline : Discipline.SCIENCE,
            time : 100,
            image : "imageurl",
        }]
      },
    };

    jest.spyOn(profilesRepository, 'fetchUserPosts').mockResolvedValue(mockPostsList);

    const result = await fetchUserPostsHandler.execute(command);

    expect(profilesRepository.fetchUserPosts).toHaveBeenCalledWith(request.userProfile);
    expect(result).toEqual(expectedResult);
  });
});
