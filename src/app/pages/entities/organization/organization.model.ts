import { BaseEntity } from 'src/model/base-entity';
import { Image } from '../image/image.model';
import { OrganizationReservation } from '../organization-reservation/organization-reservation.model';
import { User } from '../../../services/user/user.model';
import { Restaurant } from '../restaurant/restaurant.model';
import { Hotel } from '../hotel/hotel.model';
import { Club } from '../club/club.model';
import { Building } from '../building/building.model';
import { Tags } from '../tags/tags.model';

export const enum OrganizationType {
  'RESTAURANT',
  'HOTEL',
  'CLUB',
  'BUILDING',
}

export const enum RentType {
  'HOURLY',
  'HALFDAY',
  'DAY',
}

export class Organization implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public organizationType?: OrganizationType,
    public logoContentType?: string,
    public logo?: any,
    public active?: boolean,
    public activeOwner?: boolean,
    public description?: any,
    public address?: string,
    public motto?: string,
    public phone?: string,
    public webAddress?: string,
    public placeNumber?: number,
    public price?: number,
    public rentType?: RentType,
    public rentable?: boolean,
    public images?: Image[],
    public organizationReservations?: OrganizationReservation[],
    public user?: User,
    public restaurant?: Restaurant,
    public hotel?: Hotel,
    public club?: Club,
    public building?: Building,
    public tags?: Tags[]
  ) {
    this.active = false;
    this.activeOwner = false;
    this.rentable = false;
  }
}
