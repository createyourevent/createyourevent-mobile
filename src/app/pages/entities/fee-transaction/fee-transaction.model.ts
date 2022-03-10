import { BaseEntity } from 'src/model/base-entity';
import { FeeTransactionId } from '../fee-transaction-id/fee-transaction-id.model';
import { EventProductOrder } from '../event-product-order/event-product-order.model';
import { EventServiceMapOrder } from '../event-service-map-order/event-service-map-order.model';
import { Event } from '../event/event.model';
import { OrganizationReservation } from '../organization-reservation/organization-reservation.model';
import { FeeTransactionEntry } from '../fee-transaction-entry/fee-transaction-entry.model';
import { User } from '../../../services/user/user.model';

export class FeeTransaction implements BaseEntity {
  constructor(
    public id?: number,
    public date?: any,
    public transactionId?: FeeTransactionId,
    public eventProductOrder?: EventProductOrder,
    public eventServiceMapOrder?: EventServiceMapOrder,
    public event?: Event,
    public organizationReservation?: OrganizationReservation,
    public entries?: FeeTransactionEntry[],
    public user?: User
  ) {}
}
