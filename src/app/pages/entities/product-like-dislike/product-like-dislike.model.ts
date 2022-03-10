import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { User } from '../../../services/user/user.model';

export class ProductLikeDislike implements BaseEntity {
  constructor(
    public id?: number,
    public like?: number,
    public dislike?: number,
    public date?: any,
    public comment?: string,
    public product?: Product,
    public user?: User
  ) {}
}
