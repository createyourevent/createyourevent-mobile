import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { Event } from '../event/event.model';
import { User } from '../../../services/user/user.model';

export class EventProductRating implements BaseEntity {
  constructor(
    public id?: number,
    public like?: number,
    public dislike?: number,
    public date?: any,
    public comment?: string,
    public product?: Product,
    public event?: Event,
    public user?: User
  ) {}
}
