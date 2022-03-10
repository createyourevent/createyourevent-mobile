import { BaseEntity } from 'src/model/base-entity';
import { RideCosts } from '../ride-costs/ride-costs.model';
import { ServiceOffer } from '../service-offer/service-offer.model';
import { EventServiceMapOrder } from '../event-service-map-order/event-service-map-order.model';
import { CreateYourEventService } from '../create-your-event-service/create-your-event-service.model';

export class ServiceMap implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public rideCost?: RideCosts,
    public serviceOffers?: ServiceOffer[],
    public eventServiceMapOrders?: EventServiceMapOrder[],
    public createYourEventService?: CreateYourEventService
  ) {}
}
