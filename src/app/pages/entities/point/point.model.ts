import { BaseEntity } from 'src/model/base-entity';

export const enum PointsCategory {
  'EVENT',
  'SHOP',
  'SERVICE',
  'COMMENT',
  'RATING',
  'REGISTER',
  'MISCELLANEOUS',
  'PRODUCT',
}

export class Point implements BaseEntity {
  constructor(
    public id?: number,
    public key?: string,
    public name?: string,
    public keyName?: string,
    public description?: any,
    public keyDescription?: string,
    public category?: PointsCategory,
    public points?: number,
    public countPerDay?: number,
    public creationDate?: any
  ) {}
}
