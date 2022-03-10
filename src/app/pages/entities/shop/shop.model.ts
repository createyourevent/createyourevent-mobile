import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { EventProductOrder } from '../event-product-order/event-product-order.model';
import { Image } from '../image/image.model';
import { Mp3 } from '../mp-3/mp-3.model';
import { User } from '../../../services/user/user.model';
import { ShopComment } from '../shop-comment/shop-comment.model';
import { Tags } from '../tags/tags.model';

export const enum ProductType {
  'REAL_ESTATE',
  'FOOD',
  'DRINK',
  'MUSIC',
  'LIGHTSHOW',
  'DECORATION',
  'MISCELLANEOUS',
}

export class Shop implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public productType?: ProductType,
    public logoContentType?: string,
    public logo?: any,
    public active?: boolean,
    public activeOwner?: boolean,
    public description?: any,
    public address?: string,
    public motto?: string,
    public phone?: string,
    public webAddress?: string,
    public products?: Product[],
    public eventProductOrders?: EventProductOrder[],
    public images?: Image[],
    public mp3s?: Mp3[],
    public user?: User,
    public comments?: ShopComment[],
    public tags?: Tags[]
  ) {
    this.active = false;
    this.activeOwner = false;
  }
}
