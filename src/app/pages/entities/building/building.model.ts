import { BaseEntity } from 'src/model/base-entity';
import { Organization } from '../organization/organization.model';

export class Building implements BaseEntity {
  constructor(public id?: number, public surface?: number, public organization?: Organization) {}
}
