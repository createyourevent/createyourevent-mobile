import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FeeTransaction } from './fee-transaction.model';
import { FeeTransactionService } from './fee-transaction.service';
import { FeeTransactionId, FeeTransactionIdService } from '../fee-transaction-id';
import { EventProductOrder, EventProductOrderService } from '../event-product-order';
import { EventServiceMapOrder, EventServiceMapOrderService } from '../event-service-map-order';
import { Event, EventService } from '../event';
import { OrganizationReservation, OrganizationReservationService } from '../organization-reservation';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-fee-transaction-update',
  templateUrl: 'fee-transaction-update.html',
})
export class FeeTransactionUpdatePage implements OnInit {
  feeTransaction: FeeTransaction;
  feeTransactionIds: FeeTransactionId[];
  eventProductOrders: EventProductOrder[];
  eventServiceMapOrders: EventServiceMapOrder[];
  events: Event[];
  organizationReservations: OrganizationReservation[];
  users: User[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    date: [null, []],
    transactionId: [null, []],
    eventProductOrder: [null, []],
    eventServiceMapOrder: [null, []],
    event: [null, []],
    organizationReservation: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private feeTransactionIdService: FeeTransactionIdService,
    private eventProductOrderService: EventProductOrderService,
    private eventServiceMapOrderService: EventServiceMapOrderService,
    private eventService: EventService,
    private organizationReservationService: OrganizationReservationService,
    private userService: UserService,
    private feeTransactionService: FeeTransactionService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.feeTransactionIdService.query({ filter: 'feetransaction-is-null' }).subscribe(
      (data) => {
        if (!this.feeTransaction.transactionId || !this.feeTransaction.transactionId.id) {
          this.feeTransactionIds = data.body;
        } else {
          this.feeTransactionIdService.find(this.feeTransaction.transactionId.id).subscribe(
            (subData: HttpResponse<FeeTransactionId>) => {
              this.feeTransactionIds = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.eventProductOrderService.query({ filter: 'feetransaction-is-null' }).subscribe(
      (data) => {
        if (!this.feeTransaction.eventProductOrder || !this.feeTransaction.eventProductOrder.id) {
          this.eventProductOrders = data.body;
        } else {
          this.eventProductOrderService.find(this.feeTransaction.eventProductOrder.id).subscribe(
            (subData: HttpResponse<EventProductOrder>) => {
              this.eventProductOrders = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.eventServiceMapOrderService.query({ filter: 'feetransaction-is-null' }).subscribe(
      (data) => {
        if (!this.feeTransaction.eventServiceMapOrder || !this.feeTransaction.eventServiceMapOrder.id) {
          this.eventServiceMapOrders = data.body;
        } else {
          this.eventServiceMapOrderService.find(this.feeTransaction.eventServiceMapOrder.id).subscribe(
            (subData: HttpResponse<EventServiceMapOrder>) => {
              this.eventServiceMapOrders = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.eventService.query({ filter: 'feetransaction-is-null' }).subscribe(
      (data) => {
        if (!this.feeTransaction.event || !this.feeTransaction.event.id) {
          this.events = data.body;
        } else {
          this.eventService.find(this.feeTransaction.event.id).subscribe(
            (subData: HttpResponse<Event>) => {
              this.events = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.organizationReservationService.query({ filter: 'feetransaction-is-null' }).subscribe(
      (data) => {
        if (!this.feeTransaction.organizationReservation || !this.feeTransaction.organizationReservation.id) {
          this.organizationReservations = data.body;
        } else {
          this.organizationReservationService.find(this.feeTransaction.organizationReservation.id).subscribe(
            (subData: HttpResponse<OrganizationReservation>) => {
              this.organizationReservations = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.feeTransaction = response.data;
      this.isNew = this.feeTransaction.id === null || this.feeTransaction.id === undefined;
      this.updateForm(this.feeTransaction);
    });
  }

  updateForm(feeTransaction: FeeTransaction) {
    this.form.patchValue({
      id: feeTransaction.id,
      date: this.isNew ? new Date().toISOString() : feeTransaction.date,
      transactionId: feeTransaction.transactionId,
      eventProductOrder: feeTransaction.eventProductOrder,
      eventServiceMapOrder: feeTransaction.eventServiceMapOrder,
      event: feeTransaction.event,
      organizationReservation: feeTransaction.organizationReservation,
      user: feeTransaction.user,
    });
  }

  save() {
    this.isSaving = true;
    const feeTransaction = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.feeTransactionService.update(feeTransaction));
    } else {
      this.subscribeToSaveResponse(this.feeTransactionService.create(feeTransaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<FeeTransaction>>) {
    result.subscribe(
      (res: HttpResponse<FeeTransaction>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `FeeTransaction ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/fee-transaction');
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

  private createFromForm(): FeeTransaction {
    return {
      ...new FeeTransaction(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      transactionId: this.form.get(['transactionId']).value,
      eventProductOrder: this.form.get(['eventProductOrder']).value,
      eventServiceMapOrder: this.form.get(['eventServiceMapOrder']).value,
      event: this.form.get(['event']).value,
      organizationReservation: this.form.get(['organizationReservation']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareFeeTransactionId(first: FeeTransactionId, second: FeeTransactionId): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeeTransactionIdById(index: number, item: FeeTransactionId) {
    return item.id;
  }
  compareEventProductOrder(first: EventProductOrder, second: EventProductOrder): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventProductOrderById(index: number, item: EventProductOrder) {
    return item.id;
  }
  compareEventServiceMapOrder(first: EventServiceMapOrder, second: EventServiceMapOrder): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventServiceMapOrderById(index: number, item: EventServiceMapOrder) {
    return item.id;
  }
  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
  compareOrganizationReservation(first: OrganizationReservation, second: OrganizationReservation): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrganizationReservationById(index: number, item: OrganizationReservation) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
