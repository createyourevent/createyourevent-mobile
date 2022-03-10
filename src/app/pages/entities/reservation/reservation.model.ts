import { BaseEntity } from 'src/model/base-entity';
import { ReservationTransactionId } from '../reservation-transaction-id/reservation-transaction-id.model';
import { Ticket } from '../ticket/ticket.model';
import { User } from '../../../services/user/user.model';
import { Event } from '../event/event.model';

export class Reservation implements BaseEntity {
  constructor(
    public id?: number,
    public date?: any,
    public billed?: boolean,
    public accessEvent?: boolean,
    public accessDate?: any,
    public tdTxId?: string,
    public transactionId?: ReservationTransactionId,
    public ticket?: Ticket,
    public user?: User,
    public event?: Event
  ) {
    this.billed = false;
    this.accessEvent = false;
  }
}
