import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Event } from '../event/event.model';
import { Product } from '../product/product.model';

export const enum WorksheetType {
  'OFFER',
  'BILLING',
}

export const enum UserType {
  'USER',
  'SUPPLIER',
  'ORGANIZOR',
  'SERVICE',
  'ORGANIZER',
}

export class Worksheet implements BaseEntity {
  constructor(
    public id?: number,
    public description?: string,
    public start?: any,
    public end?: any,
    public costHour?: number,
    public total?: number,
    public billingType?: WorksheetType,
    public userType?: UserType,
    public user?: User,
    public event?: Event,
    public product?: Product
  ) {}
}
