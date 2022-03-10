import { BaseEntity } from 'src/model/base-entity';
import { Organization } from '../organization/organization.model';
import { User } from '../../../services/user/user.model';

export class OrganizationLikeDislike implements BaseEntity {
  constructor(
    public id?: number,
    public like?: number,
    public dislike?: number,
    public date?: any,
    public comment?: string,
    public organization?: Organization,
    public event?: Organization,
    public user?: User
  ) {}
}
