import { Test } from '@nestjs/testing';
import { User } from '../models/user.model';

describe('Tests for the User model', () => {
  let defaultUserObj: User;
  let fromJSONUserObj: User;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [User],
    }).compile();

    defaultUserObj = module.get<User>(User);
    fromJSONUserObj = User.fromData({
      id: '123',
      email: 'some@email.com',
      displayName: 'Some Name',
      photoURL: 'some/photo/url',
      phoneNumber: '123-456-7890',
      customClaims: { admin: true },
      created: null,
    });
  });

  describe ('Object Creation:', () => {
    it('Allows Parameter-Less', () => {
      expect(defaultUserObj).toBeDefined();
    });

    it('Allows from JSON', () => {
      expect(fromJSONUserObj).toBeDefined();
    });
  });

  describe('Object Export:', () => {
    it('Exports to JSON', () => {
      const json = fromJSONUserObj.toJSON();
      expect(json).toBeDefined();
      expect(json.id).toEqual('123');
    });
  });
});

