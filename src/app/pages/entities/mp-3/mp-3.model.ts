import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Product } from '../product/product.model';
import { Shop } from '../shop/shop.model';
import { Event } from '../event/event.model';
import { CreateYourEventService } from '../create-your-event-service/create-your-event-service.model';

export class Mp3 implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public artists?: string,
    public duration?: number,
    public url?: string,
    public user?: User,
    public product?: Product,
    public shop?: Shop,
    public event?: Event,
    public service?: CreateYourEventService
  ) {}
}
