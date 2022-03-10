import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { User } from '../../../services/user/user.model';

export class ProductComment implements BaseEntity {
  constructor(
    public id?: number,
    public comment?: string,
    public date?: any,
    public productComments?: ProductComment[],
    public product?: Product,
    public user?: User,
    public productComment?: ProductComment
  ) {}
}
