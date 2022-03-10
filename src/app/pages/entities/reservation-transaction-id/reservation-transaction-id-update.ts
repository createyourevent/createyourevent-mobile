import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReservationTransactionId } from './reservation-transaction-id.model';
import { ReservationTransactionIdService } from './reservation-transaction-id.service';
import { Reservation, ReservationService } from '../reservation';

@Component({
  selector: 'page-reservation-transaction-id-update',
  templateUrl: 'reservation-transaction-id-update.html',
})
export class ReservationTransactionIdUpdatePage implements OnInit {
  reservationTransactionId: ReservationTransactionId;
  reservations: Reservation[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    transactionDepositId: [null, []],
    transactionId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private reservationService: ReservationService,
    private reservationTransactionIdService: ReservationTransactionIdService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.reservationService.query().subscribe(
      (data) => {
        this.reservations = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.reservationTransactionId = response.data;
      this.isNew = this.reservationTransactionId.id === null || this.reservationTransactionId.id === undefined;
      this.updateForm(this.reservationTransactionId);
    });
  }

  updateForm(reservationTransactionId: ReservationTransactionId) {
    this.form.patchValue({
      id: reservationTransactionId.id,
      transactionDepositId: reservationTransactionId.transactionDepositId,
      transactionId: reservationTransactionId.transactionId,
    });
  }

  save() {
    this.isSaving = true;
    const reservationTransactionId = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.reservationTransactionIdService.update(reservationTransactionId));
    } else {
      this.subscribeToSaveResponse(this.reservationTransactionIdService.create(reservationTransactionId));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ReservationTransactionId>>) {
    result.subscribe(
      (res: HttpResponse<ReservationTransactionId>) => this.onSaveSuccess(res),
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
      message: `ReservationTransactionId ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/reservation-transaction-id');
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

  private createFromForm(): ReservationTransactionId {
    return {
      ...new ReservationTransactionId(),
      id: this.form.get(['id']).value,
      transactionDepositId: this.form.get(['transactionDepositId']).value,
      transactionId: this.form.get(['transactionId']).value,
    };
  }

  compareReservation(first: Reservation, second: Reservation): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackReservationById(index: number, item: Reservation) {
    return item.id;
  }
}
