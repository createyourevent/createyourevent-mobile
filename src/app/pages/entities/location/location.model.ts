import { BaseEntity } from 'src/model/base-entity';
import { Address } from '../address/address.model';
import { Event } from '../event/event.model';

export class Location implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: any,
    public photoContentType?: string,
    public photo?: any,
    public address?: Address,
    public event?: Event
  ) {}
}
