import { BaseEntity } from 'src/model/base-entity';
import { Bond } from '../bond/bond.model';

export class PointsExchange implements BaseEntity {
  constructor(public id?: number, public pointsTotal?: number, public bondPointsTotal?: number, public bonds?: Bond[]) {}
}
