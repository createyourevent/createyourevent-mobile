import { BaseEntity } from 'src/model/base-entity';
import { GiftShoppingCart } from '../gift-shopping-cart/gift-shopping-cart.model';

export class Gift implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public description?: any,
    public photoContentType?: string,
    public photo?: any,
    public points?: number,
    public active?: boolean,
    public stock?: number,
    public giftShoppingCarts?: GiftShoppingCart[]
  ) {
    this.active = false;
  }
}
