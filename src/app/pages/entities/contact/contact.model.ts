import { BaseEntity } from 'src/model/base-entity';

export class Contact implements BaseEntity {
  constructor(public id?: number, public name?: string, public email?: string, public message?: any, public date?: any) {}
}
