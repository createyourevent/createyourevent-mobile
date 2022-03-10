import { BaseEntity } from 'src/model/base-entity';
import { EventProductOrder } from '../event-product-order/event-product-order.model';
import { Product } from '../product/product.model';

export const enum DeliveryTypes {
  'PICKUP',
  'DELIVERY',
  'SHIPPING',
}

export class DeliveryType implements BaseEntity {
  constructor(
    public id?: number,
    public deliveryType?: DeliveryTypes,
    public minimumOrderQuantity?: number,
    public price?: number,
    public pricePerKilometre?: number,
    public eventProductOrders?: EventProductOrder[],
    public product?: Product
  ) {}
}
