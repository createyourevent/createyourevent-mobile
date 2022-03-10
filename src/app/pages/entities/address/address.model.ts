import { BaseEntity } from 'src/model/base-entity';
import { Location } from '../location/location.model';

export class Address implements BaseEntity {
  constructor(public id?: number, public address?: string, public lat?: number, public lng?: number, public location?: Location) {}
}
