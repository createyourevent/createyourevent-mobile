import { BaseEntity } from 'src/model/base-entity';

export class SlotListCherry implements BaseEntity {
  constructor(public id?: number, public coupons?: string) {}
}
