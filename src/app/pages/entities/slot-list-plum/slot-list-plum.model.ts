import { BaseEntity } from 'src/model/base-entity';

export class SlotListPlum implements BaseEntity {
  constructor(public id?: number, public coupons?: string) {}
}
