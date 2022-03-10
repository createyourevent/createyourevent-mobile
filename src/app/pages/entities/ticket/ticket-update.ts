import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { Event, EventService } from '../event';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Reservation, ReservationService } from '../reservation';

@Component({
  selector: 'page-ticket-update',
  templateUrl: 'ticket-update.html',
})
export class TicketUpdatePage implements OnInit {
  ticket: Ticket;
  events: Event[];
  users: User[];
  reservations: Reservation[];
  date: string;
  accessDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    amount: [null, []],
    total: [null, []],
    date: [null, []],
    refNo: [null, []],
    accessDate: [null, []],
    ticketsUsed: [null, []],
    event: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private eventService: EventService,
    private userService: UserService,
    private reservationService: ReservationService,
    private ticketService: TicketService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.reservationService.query().subscribe(
      (data) => {
        this.reservations = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.ticket = response.data;
      this.isNew = this.ticket.id === null || this.ticket.id === undefined;
      this.updateForm(this.ticket);
    });
  }

  updateForm(ticket: Ticket) {
    this.form.patchValue({
      id: ticket.id,
      amount: ticket.amount,
      total: ticket.total,
      date: this.isNew ? new Date().toISOString() : ticket.date,
      refNo: ticket.refNo,
      accessDate: this.isNew ? new Date().toISOString() : ticket.accessDate,
      ticketsUsed: ticket.ticketsUsed,
      event: ticket.event,
      user: ticket.user,
    });
  }

  save() {
    this.isSaving = true;
    const ticket = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Ticket>>) {
    result.subscribe(
      (res: HttpResponse<Ticket>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Ticket ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/ticket');
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

  private createFromForm(): Ticket {
    return {
      ...new Ticket(),
      id: this.form.get(['id']).value,
      amount: this.form.get(['amount']).value,
      total: this.form.get(['total']).value,
      date: new Date(this.form.get(['date']).value),
      refNo: this.form.get(['refNo']).value,
      accessDate: new Date(this.form.get(['accessDate']).value),
      ticketsUsed: this.form.get(['ticketsUsed']).value,
      event: this.form.get(['event']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareReservation(first: Reservation, second: Reservation): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackReservationById(index: number, item: Reservation) {
    return item.id;
  }
}
