import { BaseEntity } from 'src/model/base-entity';
import { Organization } from '../organization/organization.model';
import { User } from '../../../services/user/user.model';

export class OrganizationComment implements BaseEntity {
  constructor(
    public id?: number,
    public comment?: string,
    public date?: any,
    public organizationComments?: OrganizationComment[],
    public organization?: Organization,
    public user?: User,
    public event?: Organization,
    public organizationComment?: OrganizationComment
  ) {}
}
