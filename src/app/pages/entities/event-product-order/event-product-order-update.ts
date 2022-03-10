import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventProductOrder } from './event-product-order.model';
import { EventProductOrderService } from './event-product-order.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { FeeTransaction, FeeTransactionService } from '../fee-transaction';
import { Event, EventService } from '../event';
import { Product, ProductService } from '../product';
import { Shop, ShopService } from '../shop';
import { Cart, CartService } from '../cart';
import { DeliveryType, DeliveryTypeService } from '../delivery-type';

@Component({
  selector: 'page-event-product-order-update',
  templateUrl: 'event-product-order-update.html',
})
export class EventProductOrderUpdatePage implements OnInit {
  eventProductOrder: EventProductOrder;
  users: User[];
  feeTransactions: FeeTransaction[];
  events: Event[];
  products: Product[];
  shops: Shop[];
  carts: Cart[];
  deliveryTypes: DeliveryType[];
  date: string;
  dateFrom: string;
  dateUntil: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    amount: [null, []],
    total: [null, []],
    date: [null, []],
    rentalPeriod: [null, []],
    dateFrom: [null, []],
    dateUntil: [null, []],
    status: [null, []],
    billed: ['false', []],
    seen: ['false', []],
    approved: ['false', []],
    sellingPrice: [null, []],
    user: [null, []],
    event: [null, []],
    product: [null, []],
    shop: [null, []],
    cart: [null, []],
    deliveryType: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private feeTransactionService: FeeTransactionService,
    private eventService: EventService,
    private productService: ProductService,
    private shopService: ShopService,
    private cartService: CartService,
    private deliveryTypeService: DeliveryTypeService,
    private eventProductOrderService: EventProductOrderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.feeTransactionService.query().subscribe(
      (data) => {
        this.feeTransactions = data.body;
      },
      (error) => this.onError(error)
    );
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.productService.query().subscribe(
      (data) => {
        this.products = data.body;
      },
      (error) => this.onError(error)
    );
    this.shopService.query().subscribe(
      (data) => {
        this.shops = data.body;
      },
      (error) => this.onError(error)
    );
    this.cartService.query().subscribe(
      (data) => {
        this.carts = data.body;
      },
      (error) => this.onError(error)
    );
    this.deliveryTypeService.query().subscribe(
      (data) => {
        this.deliveryTypes = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.eventProductOrder = response.data;
      this.isNew = this.eventProductOrder.id === null || this.eventProductOrder.id === undefined;
      this.updateForm(this.eventProductOrder);
    });
  }

  updateForm(eventProductOrder: EventProductOrder) {
    this.form.patchValue({
      id: eventProductOrder.id,
      amount: eventProductOrder.amount,
      total: eventProductOrder.total,
      date: this.isNew ? new Date().toISOString() : eventProductOrder.date,
      rentalPeriod: eventProductOrder.rentalPeriod,
      dateFrom: this.isNew ? new Date().toISOString() : eventProductOrder.dateFrom,
      dateUntil: this.isNew ? new Date().toISOString() : eventProductOrder.dateUntil,
      status: eventProductOrder.status,
      billed: eventProductOrder.billed,
      seen: eventProductOrder.seen,
      approved: eventProductOrder.approved,
      sellingPrice: eventProductOrder.sellingPrice,
      user: eventProductOrder.user,
      event: eventProductOrder.event,
      product: eventProductOrder.product,
      shop: eventProductOrder.shop,
      cart: eventProductOrder.cart,
      deliveryType: eventProductOrder.deliveryType,
    });
  }

  save() {
    this.isSaving = true;
    const eventProductOrder = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventProductOrderService.update(eventProductOrder));
    } else {
      this.subscribeToSaveResponse(this.eventProductOrderService.create(eventProductOrder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventProductOrder>>) {
    result.subscribe(
      (res: HttpResponse<EventProductOrder>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `EventProductOrder ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-product-order');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  private createFromForm(): EventProductOrder {
    return {
      ...new EventProductOrder(),
      id: this.form.get(['id']).value,
      amount: this.form.get(['amount']).value,
      total: this.form.get(['total']).value,
      date: new Date(this.form.get(['date']).value),
      rentalPeriod: this.form.get(['rentalPeriod']).value,
      dateFrom: new Date(this.form.get(['dateFrom']).value),
      dateUntil: new Date(this.form.get(['dateUntil']).value),
      status: this.form.get(['status']).value,
      billed: this.form.get(['billed']).value,
      seen: this.form.get(['seen']).value,
      approved: this.form.get(['approved']).value,
      sellingPrice: this.form.get(['sellingPrice']).value,
      user: this.form.get(['user']).value,
      event: this.form.get(['event']).value,
      product: this.form.get(['product']).value,
      shop: this.form.get(['shop']).value,
      cart: this.form.get(['cart']).value,
      deliveryType: this.form.get(['deliveryType']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareFeeTransaction(first: FeeTransaction, second: FeeTransaction): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeeTransactionById(index: number, item: FeeTransaction) {
    return item.id;
  }
  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
  compareShop(first: Shop, second: Shop): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackShopById(index: number, item: Shop) {
    return item.id;
  }
  compareCart(first: Cart, second: Cart): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCartById(index: number, item: Cart) {
    return item.id;
  }
  compareDeliveryType(first: DeliveryType, second: DeliveryType): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackDeliveryTypeById(index: number, item: DeliveryType) {
    return item.id;
  }
}
