/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Test } from '@nestjs/testing';
import { FetchPostsCommand, FetchPostsResponse } from '@mp/api/feed/util';
import { FeedRepository } from '@mp/api/feed/data-access';
import { FetchPostsHandler } from '../src/commands/';
import { FilterList } from '../../util/src/interfaces/filter-list.interface';
import { Discipline } from '../../util/src/enums/discipline.enum';

describe('FetchPostsHandler Test ', () => {
  let fetchPostsHandler: FetchPostsHandler;
  let feedRepository: FeedRepository;

  beforeEach(async () => {
    // Declare a module that will be used to test the handler ( required otherwise you will get an error relating to imports outside modules )
    const moduleRef = await Test.createTestingModule({
      providers: [
        //List modules that are required for the handler to work
        FetchPostsHandler,

        // Mock the repository, will make the function return a mock value ( undefined typically returned but jest.SpyOn can return actual content [look below] )
        {
          provide: FeedRepository,
          useValue: {
            fetchPosts: jest.fn(),
          },
        },
      ],
    }).compile();

    fetchPostsHandler = moduleRef.get<FetchPostsHandler>(FetchPostsHandler);
    feedRepository = moduleRef.get<FeedRepository>(FeedRepository);
  });

  it('should be defined', () => {
    expect(fetchPostsHandler).toBeDefined();
  });

  it('should return a FetchPostsResponse object', async () => {
    // Declare parameters required for the function
    const filters: FilterList = {
      list: null,
    };
    const request = { filters };
    const command = new FetchPostsCommand(request);

    // Declare the expected code that you will typically be returned  to be returned
    const mockPostsDoc = {
      data: [
        {
          id: '1',
          title: 'Test Post 1',
          author: null,
          description: 'Test Description 1',
          content: 'Test Content 1',
          time: 1234567890,
          discipline: Discipline.SCIENCE, // Replace with an actual value from the Discipline enum
        },
      ],
    };

    const expectedResponse: FetchPostsResponse = {
      posts: {
        postsFound: true,
        list: mockPostsDoc.data,
      },
    };

    //Listener for the function call
    jest.spyOn(feedRepository, 'fetchPosts').mockResolvedValue(mockPostsDoc);

    // Execute the  command
    const result = await fetchPostsHandler.execute(command);

    //List expectations for the function call
    expect(feedRepository.fetchPosts).toHaveBeenCalledWith(filters);
    expect(result).toEqual(expectedResponse);
  });
});
