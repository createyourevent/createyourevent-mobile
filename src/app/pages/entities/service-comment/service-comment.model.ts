import { BaseEntity } from 'src/model/base-entity';
import { CreateYourEventService } from '../create-your-event-service/create-your-event-service.model';
import { User } from '../../../services/user/user.model';

export class ServiceComment implements BaseEntity {
  constructor(
    public id?: number,
    public comment?: string,
    public date?: any,
    public serviceComments?: ServiceComment[],
    public createYourEventService?: CreateYourEventService,
    public user?: User,
    public serviceComment?: ServiceComment
  ) {}
}
