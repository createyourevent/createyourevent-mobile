import { BaseEntity } from 'src/model/base-entity';
import { Event } from '../event/event.model';

export class EventDetails implements BaseEntity {
  constructor(public id?: number, public totalEntranceFee?: number, public event?: Event) {}
}
