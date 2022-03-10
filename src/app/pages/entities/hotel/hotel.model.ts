import { BaseEntity } from 'src/model/base-entity';
import { Organization } from '../organization/organization.model';
import { User } from '../../../services/user/user.model';

export class Hotel implements BaseEntity {
  constructor(
    public id?: number,
    public menu?: any,
    public placesToSleep?: number,
    public organization?: Organization,
    public user?: User
  ) {}
}
