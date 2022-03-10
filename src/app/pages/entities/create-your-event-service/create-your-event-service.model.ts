import { BaseEntity } from 'src/model/base-entity';
import { ServiceMap } from '../service-map/service-map.model';
import { Image } from '../image/image.model';
import { Mp3 } from '../mp-3/mp-3.model';
import { User } from '../../../services/user/user.model';
import { Tags } from '../tags/tags.model';

export const enum ServiceCategory {
  'SECURITAS',
  'SHUTTLESERVICE',
  'SANITARY',
  'CLEANINGSERVICE',
  'PLUMBER',
  'DISCJOKEY',
  'BAND',
  'ELECTRONICSTECHNICIAN',
  'COMPUTERSCIENTIST',
  'MISCELLANEOUS',
}

export class CreateYourEventService implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public logoContentType?: string,
    public logo?: any,
    public active?: boolean,
    public activeOwner?: boolean,
    public description?: any,
    public address?: string,
    public motto?: string,
    public phone?: string,
    public webAddress?: string,
    public category?: ServiceCategory,
    public serviceMaps?: ServiceMap[],
    public images?: Image[],
    public mp3s?: Mp3[],
    public user?: User,
    public tags?: Tags[]
  ) {
    this.active = false;
    this.activeOwner = false;
  }
}
