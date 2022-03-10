import { BaseEntity } from 'src/model/base-entity';
import { Location } from '../location/location.model';
import { EventDetails } from '../event-details/event-details.model';
import { EventProductOrder } from '../event-product-order/event-product-order.model';
import { Reservation } from '../reservation/reservation.model';
import { EventProductRatingComment } from '../event-product-rating-comment/event-product-rating-comment.model';
import { Worksheet } from '../worksheet/worksheet.model';
import { EventServiceMapOrder } from '../event-service-map-order/event-service-map-order.model';
import { Image } from '../image/image.model';
import { Mp3 } from '../mp-3/mp-3.model';
import { User } from '../../../services/user/user.model';
import { FeeTransaction } from '../fee-transaction/fee-transaction.model';
import { Tags } from '../tags/tags.model';
import { OrganizationReservation } from '../organization-reservation/organization-reservation.model';

export const enum EventCategory {
  'INDOOR',
  'OUTDOOR',
  'BIRTHDAY',
  'NATIONAL_HOLYDAY',
  'WEDDING',
  'GRADUATION',
  'HALLOWEEN',
  'NEWYEAR',
}

export const enum EventStatus {
  'PROCESSING',
  'DEFINITELY',
}

export class Event implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: any,
    public dateStart?: any,
    public dateEnd?: any,
    public category?: EventCategory,
    public price?: number,
    public flyerContentType?: string,
    public flyer?: any,
    public youtube?: string,
    public privateOrPublic?: string,
    public active?: boolean,
    public minPlacenumber?: number,
    public placenumber?: number,
    public investment?: number,
    public status?: EventStatus,
    public definitelyConfirmed?: boolean,
    public motto?: string,
    public billed?: boolean,
    public stars?: number,
    public billedOrganisator?: boolean,
    public billedeCreateYourEvent?: boolean,
    public location?: Location,
    public eventDetail?: EventDetails,
    public eventProductOrders?: EventProductOrder[],
    public reservations?: Reservation[],
    public comments?: EventProductRatingComment[],
    public worksheets?: Worksheet[],
    public eventServiceMapOrders?: EventServiceMapOrder[],
    public images?: Image[],
    public mp3s?: Mp3[],
    public user?: User,
    public feeTransaction?: FeeTransaction,
    public tags?: Tags[],
    public organizationReservations?: OrganizationReservation[]
  ) {
    this.active = false;
    this.definitelyConfirmed = false;
    this.billed = false;
    this.billedOrganisator = false;
    this.billedeCreateYourEvent = false;
  }
}
