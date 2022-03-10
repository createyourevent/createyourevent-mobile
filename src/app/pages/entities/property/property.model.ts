import { BaseEntity } from 'src/model/base-entity';

export class Property implements BaseEntity {
  constructor(public id?: number, public key?: string, public value?: string) {}
}
