import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Event } from '../event/event.model';
import { FeeTransaction } from '../fee-transaction/fee-transaction.model';
import { Organization } from '../organization/organization.model';

export class OrganizationReservation implements BaseEntity {
  constructor(
    public id?: number,
    public date?: any,
    public dateFrom?: any,
    public dateUntil?: any,
    public seen?: boolean,
    public approved?: boolean,
    public total?: number,
    public feeBilled?: boolean,
    public user?: User,
    public event?: Event,
    public feeTransaction?: FeeTransaction,
    public organization?: Organization
  ) {
    this.seen = false;
    this.approved = false;
    this.feeBilled = false;
  }
}
