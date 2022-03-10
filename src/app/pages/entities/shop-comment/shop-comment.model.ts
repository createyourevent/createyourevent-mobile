import { BaseEntity } from 'src/model/base-entity';
import { Shop } from '../shop/shop.model';
import { User } from '../../../services/user/user.model';

export class ShopComment implements BaseEntity {
  constructor(
    public id?: number,
    public comment?: string,
    public date?: any,
    public shopComments?: ShopComment[],
    public shop?: Shop,
    public user?: User,
    public shopComment?: ShopComment
  ) {}
}
