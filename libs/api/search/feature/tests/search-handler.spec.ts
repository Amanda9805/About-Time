/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { SearchCommand, SearchResponse, ProfilesList } from '@mp/api/search/util';
import { SearchRepository } from '@mp/api/search/data-access';
import { SearchHandler } from '../src/commands/';
import { SearchRequest } from '../../util/src/requests/search-request.request';

describe('Test for the search\' handler:', () => {
  let searchHandler: SearchHandler;
  let searchRepository: SearchRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SearchHandler,
        {
          provide: SearchRepository,
          useValue: {
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    searchHandler = moduleRef.get<SearchHandler>(SearchHandler);
    searchRepository = moduleRef.get<SearchRepository>(SearchRepository);
  });

  it('1. Handler should be defined.', () => {
    expect(searchHandler).toBeDefined();
  });

  it('2. SearchResponse object, should be returned.', async () => {
    const request: SearchRequest = {
        username: "user"
    };
    const command = new SearchCommand(request);
    const mockProfiles: ProfilesList = []

    const expectedResult: SearchResponse = {
      profiles: mockProfiles,
    };

    jest.spyOn(SearchRepository, 'Search').mockResolvedValue(mockProfiles);

    const result = await searchHandler.execute(command);

    expect(searchRepository.search).toHaveBeenCalledWith(request.username);
    expect(result).toEqual(expectedResult);
  });
});
