import { BaseEntity } from 'src/model/base-entity';
import { Event } from '../event/event.model';
import { Product } from '../product/product.model';
import { Shop } from '../shop/shop.model';
import { CreateYourEventService } from '../create-your-event-service/create-your-event-service.model';
import { Organization } from '../organization/organization.model';

export class Tags implements BaseEntity {
  constructor(
    public id?: number,
    public tag?: string,
    public event?: Event,
    public product?: Product,
    public shop?: Shop,
    public service?: CreateYourEventService,
    public organization?: Organization
  ) {}
}
