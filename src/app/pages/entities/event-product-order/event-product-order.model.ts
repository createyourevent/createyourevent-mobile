import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { FeeTransaction } from '../fee-transaction/fee-transaction.model';
import { Event } from '../event/event.model';
import { Product } from '../product/product.model';
import { Shop } from '../shop/shop.model';
import { Cart } from '../cart/cart.model';
import { DeliveryType } from '../delivery-type/delivery-type.model';

export const enum RentStatus {
  'BOOKED',
  'RENTED',
  'BACK',
}

export class EventProductOrder implements BaseEntity {
  constructor(
    public id?: number,
    public amount?: number,
    public total?: number,
    public date?: any,
    public rentalPeriod?: number,
    public dateFrom?: any,
    public dateUntil?: any,
    public status?: RentStatus,
    public billed?: boolean,
    public seen?: boolean,
    public approved?: boolean,
    public sellingPrice?: number,
    public user?: User,
    public feeTransaction?: FeeTransaction,
    public event?: Event,
    public product?: Product,
    public shop?: Shop,
    public cart?: Cart,
    public deliveryType?: DeliveryType
  ) {
    this.billed = false;
    this.seen = false;
    this.approved = false;
  }
}
