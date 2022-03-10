import { BaseEntity } from 'src/model/base-entity';
import { Event } from '../event/event.model';
import { User } from '../../../services/user/user.model';
import { Reservation } from '../reservation/reservation.model';

export class Ticket implements BaseEntity {
  constructor(
    public id?: number,
    public amount?: number,
    public total?: number,
    public date?: any,
    public refNo?: string,
    public accessDate?: any,
    public ticketsUsed?: number,
    public event?: Event,
    public user?: User,
    public reservation?: Reservation
  ) {}
}
