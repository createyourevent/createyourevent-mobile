import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Reservation } from './reservation.model';
import { ReservationService } from './reservation.service';
import { ReservationTransactionId, ReservationTransactionIdService } from '../reservation-transaction-id';
import { Ticket, TicketService } from '../ticket';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Event, EventService } from '../event';

@Component({
  selector: 'page-reservation-update',
  templateUrl: 'reservation-update.html',
})
export class ReservationUpdatePage implements OnInit {
  reservation: Reservation;
  reservationTransactionIds: ReservationTransactionId[];
  tickets: Ticket[];
  users: User[];
  events: Event[];
  date: string;
  accessDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    date: [null, []],
    billed: ['false', []],
    accessEvent: ['false', []],
    accessDate: [null, []],
    tdTxId: [null, []],
    transactionId: [null, []],
    ticket: [null, []],
    user: [null, []],
    event: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private reservationTransactionIdService: ReservationTransactionIdService,
    private ticketService: TicketService,
    private userService: UserService,
    private eventService: EventService,
    private reservationService: ReservationService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.reservationTransactionIdService.query({ filter: 'reservation-is-null' }).subscribe(
      (data) => {
        if (!this.reservation.transactionId || !this.reservation.transactionId.id) {
          this.reservationTransactionIds = data.body;
        } else {
          this.reservationTransactionIdService.find(this.reservation.transactionId.id).subscribe(
            (subData: HttpResponse<ReservationTransactionId>) => {
              this.reservationTransactionIds = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.ticketService.query({ filter: 'reservation-is-null' }).subscribe(
      (data) => {
        if (!this.reservation.ticket || !this.reservation.ticket.id) {
          this.tickets = data.body;
        } else {
          this.ticketService.find(this.reservation.ticket.id).subscribe(
            (subData: HttpResponse<Ticket>) => {
              this.tickets = [subData.body].concat(subData.body);
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
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.reservation = response.data;
      this.isNew = this.reservation.id === null || this.reservation.id === undefined;
      this.updateForm(this.reservation);
    });
  }

  updateForm(reservation: Reservation) {
    this.form.patchValue({
      id: reservation.id,
      date: this.isNew ? new Date().toISOString() : reservation.date,
      billed: reservation.billed,
      accessEvent: reservation.accessEvent,
      accessDate: this.isNew ? new Date().toISOString() : reservation.accessDate,
      tdTxId: reservation.tdTxId,
      transactionId: reservation.transactionId,
      ticket: reservation.ticket,
      user: reservation.user,
      event: reservation.event,
    });
  }

  save() {
    this.isSaving = true;
    const reservation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.reservationService.update(reservation));
    } else {
      this.subscribeToSaveResponse(this.reservationService.create(reservation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Reservation>>) {
    result.subscribe(
      (res: HttpResponse<Reservation>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Reservation ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/reservation');
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

  private createFromForm(): Reservation {
    return {
      ...new Reservation(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      billed: this.form.get(['billed']).value,
      accessEvent: this.form.get(['accessEvent']).value,
      accessDate: new Date(this.form.get(['accessDate']).value),
      tdTxId: this.form.get(['tdTxId']).value,
      transactionId: this.form.get(['transactionId']).value,
      ticket: this.form.get(['ticket']).value,
      user: this.form.get(['user']).value,
      event: this.form.get(['event']).value,
    };
  }

  compareReservationTransactionId(first: ReservationTransactionId, second: ReservationTransactionId): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackReservationTransactionIdById(index: number, item: ReservationTransactionId) {
    return item.id;
  }
  compareTicket(first: Ticket, second: Ticket): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTicketById(index: number, item: Ticket) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
}
