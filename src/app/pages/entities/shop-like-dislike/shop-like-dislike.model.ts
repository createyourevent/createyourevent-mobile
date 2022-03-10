import { BaseEntity } from 'src/model/base-entity';
import { Shop } from '../shop/shop.model';
import { User } from '../../../services/user/user.model';

export class ShopLikeDislike implements BaseEntity {
  constructor(
    public id?: number,
    public like?: number,
    public dislike?: number,
    public date?: any,
    public comment?: string,
    public shop?: Shop,
    public user?: User
  ) {}
}
