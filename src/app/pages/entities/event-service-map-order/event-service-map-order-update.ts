import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventServiceMapOrder } from './event-service-map-order.model';
import { EventServiceMapOrderService } from './event-service-map-order.service';
import { FeeTransaction, FeeTransactionService } from '../fee-transaction';
import { Event, EventService } from '../event';
import { ServiceMap, ServiceMapService } from '../service-map';
import { Cart, CartService } from '../cart';

@Component({
  selector: 'page-event-service-map-order-update',
  templateUrl: 'event-service-map-order-update.html',
})
export class EventServiceMapOrderUpdatePage implements OnInit {
  eventServiceMapOrder: EventServiceMapOrder;
  feeTransactions: FeeTransaction[];
  events: Event[];
  serviceMaps: ServiceMap[];
  carts: Cart[];
  date: string;
  dateFrom: string;
  dateUntil: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    date: [null, []],
    dateFrom: [null, []],
    dateUntil: [null, []],
    costHour: [null, []],
    rideCosts: [null, []],
    total: [null, []],
    totalHours: [null, []],
    kilometre: [null, []],
    billed: ['false', []],
    seen: ['false', []],
    approved: ['false', []],
    event: [null, []],
    serviceMap: [null, []],
    cart: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private feeTransactionService: FeeTransactionService,
    private eventService: EventService,
    private serviceMapService: ServiceMapService,
    private cartService: CartService,
    private eventServiceMapOrderService: EventServiceMapOrderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
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
    this.serviceMapService.query().subscribe(
      (data) => {
        this.serviceMaps = data.body;
      },
      (error) => this.onError(error)
    );
    this.cartService.query().subscribe(
      (data) => {
        this.carts = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.eventServiceMapOrder = response.data;
      this.isNew = this.eventServiceMapOrder.id === null || this.eventServiceMapOrder.id === undefined;
      this.updateForm(this.eventServiceMapOrder);
    });
  }

  updateForm(eventServiceMapOrder: EventServiceMapOrder) {
    this.form.patchValue({
      id: eventServiceMapOrder.id,
      date: this.isNew ? new Date().toISOString() : eventServiceMapOrder.date,
      dateFrom: this.isNew ? new Date().toISOString() : eventServiceMapOrder.dateFrom,
      dateUntil: this.isNew ? new Date().toISOString() : eventServiceMapOrder.dateUntil,
      costHour: eventServiceMapOrder.costHour,
      rideCosts: eventServiceMapOrder.rideCosts,
      total: eventServiceMapOrder.total,
      totalHours: eventServiceMapOrder.totalHours,
      kilometre: eventServiceMapOrder.kilometre,
      billed: eventServiceMapOrder.billed,
      seen: eventServiceMapOrder.seen,
      approved: eventServiceMapOrder.approved,
      event: eventServiceMapOrder.event,
      serviceMap: eventServiceMapOrder.serviceMap,
      cart: eventServiceMapOrder.cart,
    });
  }

  save() {
    this.isSaving = true;
    const eventServiceMapOrder = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventServiceMapOrderService.update(eventServiceMapOrder));
    } else {
      this.subscribeToSaveResponse(this.eventServiceMapOrderService.create(eventServiceMapOrder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventServiceMapOrder>>) {
    result.subscribe(
      (res: HttpResponse<EventServiceMapOrder>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `EventServiceMapOrder ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-service-map-order');
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

  private createFromForm(): EventServiceMapOrder {
    return {
      ...new EventServiceMapOrder(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      dateFrom: new Date(this.form.get(['dateFrom']).value),
      dateUntil: new Date(this.form.get(['dateUntil']).value),
      costHour: this.form.get(['costHour']).value,
      rideCosts: this.form.get(['rideCosts']).value,
      total: this.form.get(['total']).value,
      totalHours: this.form.get(['totalHours']).value,
      kilometre: this.form.get(['kilometre']).value,
      billed: this.form.get(['billed']).value,
      seen: this.form.get(['seen']).value,
      approved: this.form.get(['approved']).value,
      event: this.form.get(['event']).value,
      serviceMap: this.form.get(['serviceMap']).value,
      cart: this.form.get(['cart']).value,
    };
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
  compareServiceMap(first: ServiceMap, second: ServiceMap): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceMapById(index: number, item: ServiceMap) {
    return item.id;
  }
  compareCart(first: Cart, second: Cart): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCartById(index: number, item: Cart) {
    return item.id;
  }
}
