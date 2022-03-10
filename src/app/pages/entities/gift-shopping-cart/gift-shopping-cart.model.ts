import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Gift } from '../gift/gift.model';

export class GiftShoppingCart implements BaseEntity {
  constructor(public id?: number, public date?: any, public amount?: number, public user?: User, public gift?: Gift) {}
}
