/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { CreatePostCommand, CreatePostResponse, Status } from '@mp/api/createpost/util';
import {CreatePostRepository } from '@mp/api/createpost/data-access';
import { CreatePostHandler } from '../src/commands/';
import { CreatePostRequest } from '../../util/src/requests/create-post.request';

describe('Test for the create-post\' handler:', () => {
  let createPostHandler: CreatePostHandler;
  let createPostRepository:CreatePostRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreatePostHandler,
        {
          provide:CreatePostRepository,
          useValue: {
            createPost: jest.fn(),
          },
        },
      ],
    }).compile();

    createPostHandler = moduleRef.get<CreatePostHandler>(CreatePostHandler);
   createPostRepository = moduleRef.get<CreatePostRepository>(CreatePostRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(createPostHandler).toBeDefined();
  });

  it('2. CreatePostResponse object, should be returned.', async () => {
    const request: CreatePostRequest = {
        post: {
            title : "title",
            author : "author",
            description : "desc",
            content : "content",
            discipline : "disc",
            image : "img"
        },
    };
    const command = new CreatePostCommand(request);
    const mockStatus: Status = Status.SUCCESS;

    const expectedResult: CreatePostResponse = {
      status: mockStatus,
    };

    jest.spyOn(createPostRepository, 'createPost').mockResolvedValue(mockStatus);

    const result = await createPostHandler.execute(command);

    expect(createPostRepository.createPost).toHaveBeenCalledWith(request.post);
    expect(result).toEqual(expectedResult);
  });
});