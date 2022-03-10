import { BaseEntity } from 'src/model/base-entity';

export class SlotListOrange implements BaseEntity {
  constructor(public id?: number, public coupons?: string) {}
}
