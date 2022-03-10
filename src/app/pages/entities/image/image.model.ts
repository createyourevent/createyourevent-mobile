import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Product } from '../product/product.model';
import { Shop } from '../shop/shop.model';
import { Event } from '../event/event.model';
import { CreateYourEventService } from '../create-your-event-service/create-your-event-service.model';
import { Organization } from '../organization/organization.model';

export class Image implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public imageContentType?: string,
    public image?: any,
    public user?: User,
    public product?: Product,
    public shop?: Shop,
    public event?: Event,
    public service?: CreateYourEventService,
    public organization?: Organization
  ) {}
}
