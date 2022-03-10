import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationReservation } from './organization-reservation.model';
import { OrganizationReservationService } from './organization-reservation.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Event, EventService } from '../event';
import { FeeTransaction, FeeTransactionService } from '../fee-transaction';
import { Organization, OrganizationService } from '../organization';

@Component({
  selector: 'page-organization-reservation-update',
  templateUrl: 'organization-reservation-update.html',
})
export class OrganizationReservationUpdatePage implements OnInit {
  organizationReservation: OrganizationReservation;
  users: User[];
  events: Event[];
  feeTransactions: FeeTransaction[];
  organizations: Organization[];
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
    seen: ['false', []],
    approved: ['false', []],
    total: [null, []],
    feeBilled: ['false', []],
    user: [null, []],
    event: [null, []],
    organization: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private eventService: EventService,
    private feeTransactionService: FeeTransactionService,
    private organizationService: OrganizationService,
    private organizationReservationService: OrganizationReservationService
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
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.feeTransactionService.query().subscribe(
      (data) => {
        this.feeTransactions = data.body;
      },
      (error) => this.onError(error)
    );
    this.organizationService.query().subscribe(
      (data) => {
        this.organizations = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.organizationReservation = response.data;
      this.isNew = this.organizationReservation.id === null || this.organizationReservation.id === undefined;
      this.updateForm(this.organizationReservation);
    });
  }

  updateForm(organizationReservation: OrganizationReservation) {
    this.form.patchValue({
      id: organizationReservation.id,
      date: this.isNew ? new Date().toISOString() : organizationReservation.date,
      dateFrom: this.isNew ? new Date().toISOString() : organizationReservation.dateFrom,
      dateUntil: this.isNew ? new Date().toISOString() : organizationReservation.dateUntil,
      seen: organizationReservation.seen,
      approved: organizationReservation.approved,
      total: organizationReservation.total,
      feeBilled: organizationReservation.feeBilled,
      user: organizationReservation.user,
      event: organizationReservation.event,
      organization: organizationReservation.organization,
    });
  }

  save() {
    this.isSaving = true;
    const organizationReservation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.organizationReservationService.update(organizationReservation));
    } else {
      this.subscribeToSaveResponse(this.organizationReservationService.create(organizationReservation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrganizationReservation>>) {
    result.subscribe(
      (res: HttpResponse<OrganizationReservation>) => this.onSaveSuccess(res),
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
      message: `OrganizationReservation ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/organization-reservation');
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

  private createFromForm(): OrganizationReservation {
    return {
      ...new OrganizationReservation(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      dateFrom: new Date(this.form.get(['dateFrom']).value),
      dateUntil: new Date(this.form.get(['dateUntil']).value),
      seen: this.form.get(['seen']).value,
      approved: this.form.get(['approved']).value,
      total: this.form.get(['total']).value,
      feeBilled: this.form.get(['feeBilled']).value,
      user: this.form.get(['user']).value,
      event: this.form.get(['event']).value,
      organization: this.form.get(['organization']).value,
    };
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
  compareFeeTransaction(first: FeeTransaction, second: FeeTransaction): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeeTransactionById(index: number, item: FeeTransaction) {
    return item.id;
  }
  compareOrganization(first: Organization, second: Organization): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrganizationById(index: number, item: Organization) {
    return item.id;
  }
}
