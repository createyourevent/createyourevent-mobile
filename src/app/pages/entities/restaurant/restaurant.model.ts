import { BaseEntity } from 'src/model/base-entity';
import { Organization } from '../organization/organization.model';
import { User } from '../../../services/user/user.model';

export class Restaurant implements BaseEntity {
  constructor(public id?: number, public menu?: any, public organization?: Organization, public user?: User) {}
}
