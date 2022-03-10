import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { User } from '../../../services/user/user.model';

export class ProductStarRating implements BaseEntity {
  constructor(
    public id?: number,
    public stars?: number,
    public date?: any,
    public comment?: string,
    public product?: Product,
    public user?: User
  ) {}
}
