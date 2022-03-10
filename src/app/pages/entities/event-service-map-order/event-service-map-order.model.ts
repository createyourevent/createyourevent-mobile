import { BaseEntity } from 'src/model/base-entity';
import { FeeTransaction } from '../fee-transaction/fee-transaction.model';
import { Event } from '../event/event.model';
import { ServiceMap } from '../service-map/service-map.model';
import { Cart } from '../cart/cart.model';

export class EventServiceMapOrder implements BaseEntity {
  constructor(
    public id?: number,
    public date?: any,
    public dateFrom?: any,
    public dateUntil?: any,
    public costHour?: number,
    public rideCosts?: number,
    public total?: number,
    public totalHours?: string,
    public kilometre?: number,
    public billed?: boolean,
    public seen?: boolean,
    public approved?: boolean,
    public feeTransaction?: FeeTransaction,
    public event?: Event,
    public serviceMap?: ServiceMap,
    public cart?: Cart
  ) {
    this.billed = false;
    this.seen = false;
    this.approved = false;
  }
}
