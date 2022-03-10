import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Point', component: 'PointPage', route: 'point' },
    { name: 'PointsExchange', component: 'PointsExchangePage', route: 'points-exchange' },
    { name: 'Bond', component: 'BondPage', route: 'bond' },
    { name: 'UserPointAssociation', component: 'UserPointAssociationPage', route: 'user-point-association' },
    { name: 'Organization', component: 'OrganizationPage', route: 'organization' },
    { name: 'OrganizationReservation', component: 'OrganizationReservationPage', route: 'organization-reservation' },
    { name: 'Building', component: 'BuildingPage', route: 'building' },
    { name: 'Worksheet', component: 'WorksheetPage', route: 'worksheet' },
    { name: 'AdminFeesPrice', component: 'AdminFeesPricePage', route: 'admin-fees-price' },
    { name: 'Shop', component: 'ShopPage', route: 'shop' },
    { name: 'Restaurant', component: 'RestaurantPage', route: 'restaurant' },
    { name: 'Club', component: 'ClubPage', route: 'club' },
    { name: 'Hotel', component: 'HotelPage', route: 'hotel' },
    { name: 'CreateYourEventService', component: 'CreateYourEventServicePage', route: 'create-your-event-service' },
    { name: 'ServiceOffer', component: 'ServiceOfferPage', route: 'service-offer' },
    { name: 'ServiceMap', component: 'ServiceMapPage', route: 'service-map' },
    { name: 'RideCosts', component: 'RideCostsPage', route: 'ride-costs' },
    { name: 'Order', component: 'OrderPage', route: 'order' },
    { name: 'ShopComment', component: 'ShopCommentPage', route: 'shop-comment' },
    { name: 'EventDetails', component: 'EventDetailsPage', route: 'event-details' },
    { name: 'Reservation', component: 'ReservationPage', route: 'reservation' },
    { name: 'Product', component: 'ProductPage', route: 'product' },
    { name: 'DeliveryType', component: 'DeliveryTypePage', route: 'delivery-type' },
    { name: 'ShopLikeDislike', component: 'ShopLikeDislikePage', route: 'shop-like-dislike' },
    { name: 'ServiceLikeDislike', component: 'ServiceLikeDislikePage', route: 'service-like-dislike' },
    { name: 'ProductLikeDislike', component: 'ProductLikeDislikePage', route: 'product-like-dislike' },
    { name: 'ProductComment', component: 'ProductCommentPage', route: 'product-comment' },
    { name: 'OrganizationLikeDislike', component: 'OrganizationLikeDislikePage', route: 'organization-like-dislike' },
    { name: 'OrganizationComment', component: 'OrganizationCommentPage', route: 'organization-comment' },
    { name: 'ServiceComment', component: 'ServiceCommentPage', route: 'service-comment' },
    { name: 'EventLikeDislike', component: 'EventLikeDislikePage', route: 'event-like-dislike' },
    { name: 'EventComment', component: 'EventCommentPage', route: 'event-comment' },
    { name: 'EventProductRating', component: 'EventProductRatingPage', route: 'event-product-rating' },
    { name: 'EventStarRating', component: 'EventStarRatingPage', route: 'event-star-rating' },
    { name: 'OrganizationStarRating', component: 'OrganizationStarRatingPage', route: 'organization-star-rating' },
    { name: 'ShopStarRating', component: 'ShopStarRatingPage', route: 'shop-star-rating' },
    { name: 'ProductStarRating', component: 'ProductStarRatingPage', route: 'product-star-rating' },
    { name: 'ServiceStarRating', component: 'ServiceStarRatingPage', route: 'service-star-rating' },
    { name: 'EventProductOrder', component: 'EventProductOrderPage', route: 'event-product-order' },
    { name: 'EventServiceMapOrder', component: 'EventServiceMapOrderPage', route: 'event-service-map-order' },
    { name: 'ReservationTransactionId', component: 'ReservationTransactionIdPage', route: 'reservation-transaction-id' },
    { name: 'FeeTransactionId', component: 'FeeTransactionIdPage', route: 'fee-transaction-id' },
    { name: 'FeeTransaction', component: 'FeeTransactionPage', route: 'fee-transaction' },
    { name: 'FeeTransactionEntry', component: 'FeeTransactionEntryPage', route: 'fee-transaction-entry' },
    { name: 'Cart', component: 'CartPage', route: 'cart' },
    { name: 'EventProductRatingComment', component: 'EventProductRatingCommentPage', route: 'event-product-rating-comment' },
    { name: 'Event', component: 'EventPage', route: 'event' },
    { name: 'Image', component: 'ImagePage', route: 'image' },
    { name: 'Chips', component: 'ChipsPage', route: 'chips' },
    { name: 'FeeBalance', component: 'FeeBalancePage', route: 'fee-balance' },
    { name: 'ChipsCollectionChips', component: 'ChipsCollectionChipsPage', route: 'chips-collection-chips' },
    { name: 'ChipsCollection', component: 'ChipsCollectionPage', route: 'chips-collection' },
    { name: 'ChipsAdmin', component: 'ChipsAdminPage', route: 'chips-admin' },
    { name: 'Location', component: 'LocationPage', route: 'location' },
    { name: 'Address', component: 'AddressPage', route: 'address' },
    { name: 'Contact', component: 'ContactPage', route: 'contact' },
    { name: 'Tags', component: 'TagsPage', route: 'tags' },
    { name: 'Gift', component: 'GiftPage', route: 'gift' },
    { name: 'GiftShoppingCart', component: 'GiftShoppingCartPage', route: 'gift-shopping-cart' },
    { name: 'Property', component: 'PropertyPage', route: 'property' },
    { name: 'Partner', component: 'PartnerPage', route: 'partner' },
    { name: 'UserExtension', component: 'UserExtensionPage', route: 'user-extension' },
    { name: 'Mp3', component: 'Mp3Page', route: 'mp-3' },
    { name: 'Ticket', component: 'TicketPage', route: 'ticket' },
    { name: 'Coupon', component: 'CouponPage', route: 'coupon' },
    { name: 'SlotListClock', component: 'SlotListClockPage', route: 'slot-list-clock' },
    { name: 'SlotListCherry', component: 'SlotListCherryPage', route: 'slot-list-cherry' },
    { name: 'SlotListOrange', component: 'SlotListOrangePage', route: 'slot-list-orange' },
    { name: 'SlotListPlum', component: 'SlotListPlumPage', route: 'slot-list-plum' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}