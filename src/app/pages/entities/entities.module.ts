import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { EntitiesPage } from './entities.page';

const routes: Routes = [
  {
    path: '',
    component: EntitiesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'point',
    loadChildren: './point/point.module#PointPageModule',
  },
  {
    path: 'points-exchange',
    loadChildren: './points-exchange/points-exchange.module#PointsExchangePageModule',
  },
  {
    path: 'bond',
    loadChildren: './bond/bond.module#BondPageModule',
  },
  {
    path: 'user-point-association',
    loadChildren: './user-point-association/user-point-association.module#UserPointAssociationPageModule',
  },
  {
    path: 'organization',
    loadChildren: './organization/organization.module#OrganizationPageModule',
  },
  {
    path: 'organization-reservation',
    loadChildren: './organization-reservation/organization-reservation.module#OrganizationReservationPageModule',
  },
  {
    path: 'building',
    loadChildren: './building/building.module#BuildingPageModule',
  },
  {
    path: 'worksheet',
    loadChildren: './worksheet/worksheet.module#WorksheetPageModule',
  },
  {
    path: 'admin-fees-price',
    loadChildren: './admin-fees-price/admin-fees-price.module#AdminFeesPricePageModule',
  },
  {
    path: 'shop',
    loadChildren: './shop/shop.module#ShopPageModule',
  },
  {
    path: 'restaurant',
    loadChildren: './restaurant/restaurant.module#RestaurantPageModule',
  },
  {
    path: 'club',
    loadChildren: './club/club.module#ClubPageModule',
  },
  {
    path: 'hotel',
    loadChildren: './hotel/hotel.module#HotelPageModule',
  },
  {
    path: 'create-your-event-service',
    loadChildren: './create-your-event-service/create-your-event-service.module#CreateYourEventServicePageModule',
  },
  {
    path: 'service-offer',
    loadChildren: './service-offer/service-offer.module#ServiceOfferPageModule',
  },
  {
    path: 'service-map',
    loadChildren: './service-map/service-map.module#ServiceMapPageModule',
  },
  {
    path: 'ride-costs',
    loadChildren: './ride-costs/ride-costs.module#RideCostsPageModule',
  },
  {
    path: 'order',
    loadChildren: './order/order.module#OrderPageModule',
  },
  {
    path: 'shop-comment',
    loadChildren: './shop-comment/shop-comment.module#ShopCommentPageModule',
  },
  {
    path: 'event-details',
    loadChildren: './event-details/event-details.module#EventDetailsPageModule',
  },
  {
    path: 'reservation',
    loadChildren: './reservation/reservation.module#ReservationPageModule',
  },
  {
    path: 'product',
    loadChildren: './product/product.module#ProductPageModule',
  },
  {
    path: 'delivery-type',
    loadChildren: './delivery-type/delivery-type.module#DeliveryTypePageModule',
  },
  {
    path: 'shop-like-dislike',
    loadChildren: './shop-like-dislike/shop-like-dislike.module#ShopLikeDislikePageModule',
  },
  {
    path: 'service-like-dislike',
    loadChildren: './service-like-dislike/service-like-dislike.module#ServiceLikeDislikePageModule',
  },
  {
    path: 'product-like-dislike',
    loadChildren: './product-like-dislike/product-like-dislike.module#ProductLikeDislikePageModule',
  },
  {
    path: 'product-comment',
    loadChildren: './product-comment/product-comment.module#ProductCommentPageModule',
  },
  {
    path: 'organization-like-dislike',
    loadChildren: './organization-like-dislike/organization-like-dislike.module#OrganizationLikeDislikePageModule',
  },
  {
    path: 'organization-comment',
    loadChildren: './organization-comment/organization-comment.module#OrganizationCommentPageModule',
  },
  {
    path: 'service-comment',
    loadChildren: './service-comment/service-comment.module#ServiceCommentPageModule',
  },
  {
    path: 'event-like-dislike',
    loadChildren: './event-like-dislike/event-like-dislike.module#EventLikeDislikePageModule',
  },
  {
    path: 'event-comment',
    loadChildren: './event-comment/event-comment.module#EventCommentPageModule',
  },
  {
    path: 'event-product-rating',
    loadChildren: './event-product-rating/event-product-rating.module#EventProductRatingPageModule',
  },
  {
    path: 'event-star-rating',
    loadChildren: './event-star-rating/event-star-rating.module#EventStarRatingPageModule',
  },
  {
    path: 'organization-star-rating',
    loadChildren: './organization-star-rating/organization-star-rating.module#OrganizationStarRatingPageModule',
  },
  {
    path: 'shop-star-rating',
    loadChildren: './shop-star-rating/shop-star-rating.module#ShopStarRatingPageModule',
  },
  {
    path: 'product-star-rating',
    loadChildren: './product-star-rating/product-star-rating.module#ProductStarRatingPageModule',
  },
  {
    path: 'service-star-rating',
    loadChildren: './service-star-rating/service-star-rating.module#ServiceStarRatingPageModule',
  },
  {
    path: 'event-product-order',
    loadChildren: './event-product-order/event-product-order.module#EventProductOrderPageModule',
  },
  {
    path: 'event-service-map-order',
    loadChildren: './event-service-map-order/event-service-map-order.module#EventServiceMapOrderPageModule',
  },
  {
    path: 'reservation-transaction-id',
    loadChildren: './reservation-transaction-id/reservation-transaction-id.module#ReservationTransactionIdPageModule',
  },
  {
    path: 'fee-transaction-id',
    loadChildren: './fee-transaction-id/fee-transaction-id.module#FeeTransactionIdPageModule',
  },
  {
    path: 'fee-transaction',
    loadChildren: './fee-transaction/fee-transaction.module#FeeTransactionPageModule',
  },
  {
    path: 'fee-transaction-entry',
    loadChildren: './fee-transaction-entry/fee-transaction-entry.module#FeeTransactionEntryPageModule',
  },
  {
    path: 'cart',
    loadChildren: './cart/cart.module#CartPageModule',
  },
  {
    path: 'event-product-rating-comment',
    loadChildren: './event-product-rating-comment/event-product-rating-comment.module#EventProductRatingCommentPageModule',
  },
  {
    path: 'event',
    loadChildren: './event/event.module#EventPageModule',
  },
  {
    path: 'image',
    loadChildren: './image/image.module#ImagePageModule',
  },
  {
    path: 'chips',
    loadChildren: './chips/chips.module#ChipsPageModule',
  },
  {
    path: 'fee-balance',
    loadChildren: './fee-balance/fee-balance.module#FeeBalancePageModule',
  },
  {
    path: 'chips-collection-chips',
    loadChildren: './chips-collection-chips/chips-collection-chips.module#ChipsCollectionChipsPageModule',
  },
  {
    path: 'chips-collection',
    loadChildren: './chips-collection/chips-collection.module#ChipsCollectionPageModule',
  },
  {
    path: 'chips-admin',
    loadChildren: './chips-admin/chips-admin.module#ChipsAdminPageModule',
  },
  {
    path: 'location',
    loadChildren: './location/location.module#LocationPageModule',
  },
  {
    path: 'address',
    loadChildren: './address/address.module#AddressPageModule',
  },
  {
    path: 'contact',
    loadChildren: './contact/contact.module#ContactPageModule',
  },
  {
    path: 'tags',
    loadChildren: './tags/tags.module#TagsPageModule',
  },
  {
    path: 'gift',
    loadChildren: './gift/gift.module#GiftPageModule',
  },
  {
    path: 'gift-shopping-cart',
    loadChildren: './gift-shopping-cart/gift-shopping-cart.module#GiftShoppingCartPageModule',
  },
  {
    path: 'property',
    loadChildren: './property/property.module#PropertyPageModule',
  },
  {
    path: 'partner',
    loadChildren: './partner/partner.module#PartnerPageModule',
  },
  {
    path: 'user-extension',
    loadChildren: './user-extension/user-extension.module#UserExtensionPageModule',
  },
  {
    path: 'mp-3',
    loadChildren: './mp-3/mp-3.module#Mp3PageModule',
  },
  {
    path: 'ticket',
    loadChildren: './ticket/ticket.module#TicketPageModule',
  },
  {
    path: 'coupon',
    loadChildren: './coupon/coupon.module#CouponPageModule',
  },
  {
    path: 'slot-list-clock',
    loadChildren: './slot-list-clock/slot-list-clock.module#SlotListClockPageModule',
  },
  {
    path: 'slot-list-cherry',
    loadChildren: './slot-list-cherry/slot-list-cherry.module#SlotListCherryPageModule',
  },
  {
    path: 'slot-list-orange',
    loadChildren: './slot-list-orange/slot-list-orange.module#SlotListOrangePageModule',
  },
  {
    path: 'slot-list-plum',
    loadChildren: './slot-list-plum/slot-list-plum.module#SlotListPlumPageModule',
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage],
})
export class EntitiesPageModule {}
