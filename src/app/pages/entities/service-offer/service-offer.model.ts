import { BaseEntity } from 'src/model/base-entity';
import { ServiceMap } from '../service-map/service-map.model';

export class ServiceOffer implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public description?: any,
    public costHour?: number,
    public serviceMaps?: ServiceMap
  ) {}
}
