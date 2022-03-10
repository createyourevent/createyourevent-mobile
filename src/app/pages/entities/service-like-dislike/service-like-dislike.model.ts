import { BaseEntity } from 'src/model/base-entity';
import { CreateYourEventService } from '../create-your-event-service/create-your-event-service.model';
import { User } from '../../../services/user/user.model';

export class ServiceLikeDislike implements BaseEntity {
  constructor(
    public id?: number,
    public like?: number,
    public dislike?: number,
    public date?: any,
    public comment?: string,
    public createYourEventService?: CreateYourEventService,
    public user?: User
  ) {}
}
