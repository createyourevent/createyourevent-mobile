import { BaseEntity } from 'src/model/base-entity';
import { Event } from '../event/event.model';
import { User } from '../../../services/user/user.model';

export class EventStarRating implements BaseEntity {
  constructor(
    public id?: number,
    public stars?: number,
    public date?: any,
    public comment?: string,
    public event?: Event,
    public user?: User
  ) {}
}
