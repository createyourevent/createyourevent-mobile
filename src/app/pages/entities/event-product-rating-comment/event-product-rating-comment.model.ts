import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Event } from '../event/event.model';
import { Product } from '../product/product.model';

export class EventProductRatingComment implements BaseEntity {
  constructor(
    public id?: number,
    public comment?: string,
    public date?: any,
    public user?: User,
    public event?: Event,
    public product?: Product
  ) {}
}
