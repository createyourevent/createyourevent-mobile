import { BaseEntity } from 'src/model/base-entity';
import { EventProductOrder } from '../event-product-order/event-product-order.model';
import { EventProductRatingComment } from '../event-product-rating-comment/event-product-rating-comment.model';
import { Worksheet } from '../worksheet/worksheet.model';
import { Image } from '../image/image.model';
import { Mp3 } from '../mp-3/mp-3.model';
import { Shop } from '../shop/shop.model';
import { Tags } from '../tags/tags.model';
import { DeliveryType } from '../delivery-type/delivery-type.model';

export const enum PriceType {
  'SELL',
  'RENT',
}

export const enum RentType {
  'HOURLY',
  'HALFDAY',
  'DAY',
}

export const enum ProductType {
  'REAL_ESTATE',
  'FOOD',
  'DRINK',
  'MUSIC',
  'LIGHTSHOW',
  'DECORATION',
  'MISCELLANEOUS',
}

export const enum OrderStatus {
  'NEW',
  'PROCESSING',
  'COMPLETED',
}

export const enum Unit {
  'ITEM',
  'GRAM',
  'KILOGRAM',
  'TONNE',
  'MILLIMETER',
  'CENTIMETER',
  'METER',
  'MILILITER',
  'CENTILITER',
  'DECILITER',
  'LITER',
}

export class Product implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public keywords?: string,
    public description?: any,
    public dateAdded?: any,
    public dateModified?: any,
    public priceType?: PriceType,
    public rentType?: RentType,
    public price?: number,
    public photoContentType?: string,
    public photo?: any,
    public photo2ContentType?: string,
    public photo2?: any,
    public photo3ContentType?: string,
    public photo3?: any,
    public youtube?: string,
    public active?: boolean,
    public stock?: number,
    public productType?: ProductType,
    public itemNumber?: string,
    public status?: OrderStatus,
    public unit?: Unit,
    public amount?: number,
    public motto?: string,
    public eventProductOrders?: EventProductOrder[],
    public comments?: EventProductRatingComment[],
    public worksheets?: Worksheet[],
    public images?: Image[],
    public mp3s?: Mp3[],
    public shop?: Shop,
    public tags?: Tags[],
    public deliveryTypes?: DeliveryType[]
  ) {
    this.active = false;
  }
}
