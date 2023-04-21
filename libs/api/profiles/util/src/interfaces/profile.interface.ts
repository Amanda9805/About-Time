import { Timestamp } from 'firebase-admin/firestore';
import { ProfileStatus } from '../enums';
import { IAccountDetails } from './account-details.interface';
// import { IAddressDetails } from './address-details.interface';
// import { IContactDetails } from './contact-details.interface';
// import { IOccupationDetails } from './occupation-details.interface';
// import { IPersonalDetails } from './personal-details.interface';

export interface IProfile {
  userId: string;
  accountDetails?: IAccountDetails | null | undefined;
  status?: ProfileStatus | null | undefined;
  created?: Timestamp | null | undefined;
  time?: number | null | undefined;
}
