import { BaseEntity } from 'src/model/base-entity';
import { CreateYourEventService } from '../create-your-event-service/create-your-event-service.model';
import { User } from '../../../services/user/user.model';

export class ServiceStarRating implements BaseEntity {
  constructor(
    public id?: number,
    public stars?: number,
    public date?: any,
    public comment?: string,
    public service?: CreateYourEventService,
    public user?: User
  ) {}
}
