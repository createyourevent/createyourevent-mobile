import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export const enum FeeType {
  'EVENT',
  'EVENTPRODUCTORDER',
  'EVENTSERVICEMAPORDER',
  'ORGANIZATIONRESERVATION',
}

export class FeeBalance implements BaseEntity {
  constructor(public id?: number, public date?: any, public type?: FeeType, public total?: number, public user?: User) {}
}
