import { BaseEntity } from 'src/model/base-entity';

export const enum OrderStatus {
  'NEW',
  'PROCESSING',
  'COMPLETED',
}

export class Order implements BaseEntity {
  constructor(public id?: number, public status?: OrderStatus, public dateAdded?: any) {}
}
