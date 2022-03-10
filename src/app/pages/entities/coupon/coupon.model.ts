import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Event } from '../event/event.model';

export class Coupon implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public value?: number,
    public description?: any,
    public couponNr?: string,
    public used?: boolean,
    public user?: User,
    public event?: Event
  ) {
    this.used = false;
  }
}
