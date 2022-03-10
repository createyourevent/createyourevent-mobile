import { BaseEntity } from 'src/model/base-entity';
import { Organization } from '../organization/organization.model';
import { User } from '../../../services/user/user.model';

export class OrganizationStarRating implements BaseEntity {
  constructor(
    public id?: number,
    public stars?: number,
    public date?: any,
    public comment?: string,
    public organization?: Organization,
    public user?: User
  ) {}
}
