import { BaseEntity } from 'src/model/base-entity';
import { ServiceMap } from '../service-map/service-map.model';

export class RideCosts implements BaseEntity {
  constructor(public id?: number, public pricePerKilometre?: number, public serviceMap?: ServiceMap) {}
}
