import { Test } from '@nestjs/testing';
import { FetchPostsCommand, FetchPostsResponse } from '@mp/api/feed/util';
import { FeedRepository } from '@mp/api/feed/data-access';
import { FetchPostsHandler } from '../src/commands/';

describe('FetchPostsHandler', () => {
  let fetchPostsHandler: FetchPostsHandler;
  let feedRepository: FeedRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FetchPostsHandler,
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

  // it('should return a FetchPostsResponse object', async () => {
  //   const filters = undefined;
  //   const request = { filters };
  //   const command = new FetchPostsCommand(request);

  //   const mockPostsDoc = {
  //     data: [
  //       {
  //         id: '1',
  //         title: 'Test Post 1',
  //         content: 'Test Content 1',
  //       },
  //     ],
  //   };

  //   jest.spyOn(feedRepository, 'fetchPosts').mockResolvedValue(mockPostsDoc);

  //   const expectedResponse: FetchPostsResponse = {
  //     posts: {
  //       postsFound: true,
  //       list: mockPostsDoc.data,
  //     },
  //   };

  //   const result = await fetchPostsHandler.execute(command);

  //   expect(feedRepository.fetchPosts).toHaveBeenCalledWith(filters);
  //   expect(result).toEqual(expectedResponse);
  // });
});
