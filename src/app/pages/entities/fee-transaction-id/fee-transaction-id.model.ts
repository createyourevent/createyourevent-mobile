import { BaseEntity } from 'src/model/base-entity';
import { FeeTransaction } from '../fee-transaction/fee-transaction.model';

export class FeeTransactionId implements BaseEntity {
  constructor(public id?: number, public transactionId?: string, public feeTransaction?: FeeTransaction) {}
}
