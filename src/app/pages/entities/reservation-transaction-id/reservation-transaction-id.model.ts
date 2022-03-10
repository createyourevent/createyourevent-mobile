import { BaseEntity } from 'src/model/base-entity';
import { Reservation } from '../reservation/reservation.model';

export class ReservationTransactionId implements BaseEntity {
  constructor(public id?: number, public transactionDepositId?: string, public transactionId?: string, public reservation?: Reservation) {}
}
