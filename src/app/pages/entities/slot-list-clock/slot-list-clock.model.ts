import { BaseEntity } from 'src/model/base-entity';

export class SlotListClock implements BaseEntity {
  constructor(public id?: number, public coupons?: string) {}
}
