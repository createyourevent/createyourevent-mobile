import { BaseEntity } from 'src/model/base-entity';
import { EventProductOrder } from '../event-product-order/event-product-order.model';
import { EventServiceMapOrder } from '../event-service-map-order/event-service-map-order.model';

export class Cart implements BaseEntity {
  constructor(
    public id?: number,
    public date?: any,
    public totalCosts?: number,
    public products?: EventProductOrder[],
    public services?: EventServiceMapOrder[]
  ) {}
}
