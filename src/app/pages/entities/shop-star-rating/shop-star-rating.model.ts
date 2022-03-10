import { BaseEntity } from 'src/model/base-entity';
import { Shop } from '../shop/shop.model';
import { User } from '../../../services/user/user.model';

export class ShopStarRating implements BaseEntity {
  constructor(
    public id?: number,
    public stars?: number,
    public date?: any,
    public comment?: string,
    public shop?: Shop,
    public user?: User
  ) {}
}
