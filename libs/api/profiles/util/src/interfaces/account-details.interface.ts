import { ProfileStatus } from '../enums';
import { IBadge } from './badge.interface';
import { IMeter } from './meter.interface';

export interface IAccountDetails {
  email?: string | null | undefined;
  photoURL?: string | null | undefined;
  userName?: string | null | undefined;
  title?: string | null | undefined;
  friends?: string[] | null | undefined;
  friendRequests?: string[] | null | undefined;
  blockedUsers?: string[] | null | undefined;
  meters?: IMeter[] | null | undefined;
  badgesReceived?: IBadge[] | null | undefined;
  private?: boolean | null | undefined;
}
