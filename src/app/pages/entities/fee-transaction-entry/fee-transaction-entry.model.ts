import { BaseEntity } from 'src/model/base-entity';
import { FeeTransaction } from '../fee-transaction/fee-transaction.model';

export const enum FeeType {
  'EVENT',
  'EVENTPRODUCTORDER',
  'EVENTSERVICEMAPORDER',
  'ORGANIZATIONRESERVATION',
}

export class FeeTransactionEntry implements BaseEntity {
  constructor(public id?: number, public type?: FeeType, public value?: number, public feeTransaction?: FeeTransaction) {}
}
