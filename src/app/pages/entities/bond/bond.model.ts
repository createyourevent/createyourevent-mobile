import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { PointsExchange } from '../points-exchange/points-exchange.model';

export class Bond implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: any,
    public code?: string,
    public points?: number,
    public creationDate?: any,
    public redemptionDate?: any,
    public user?: User,
    public pointsExchange?: PointsExchange
  ) {}
}
