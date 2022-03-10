import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventDetails } from './event-details.model';
import { EventDetailsService } from './event-details.service';
import { Event, EventService } from '../event';

@Component({
  selector: 'page-event-details-update',
  templateUrl: 'event-details-update.html',
})
export class EventDetailsUpdatePage implements OnInit {
  eventDetails: EventDetails;
  events: Event[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    totalEntranceFee: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private eventService: EventService,
    private eventDetailsService: EventDetailsService
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
    this.activatedRoute.data.subscribe((response) => {
      this.eventDetails = response.data;
      this.isNew = this.eventDetails.id === null || this.eventDetails.id === undefined;
      this.updateForm(this.eventDetails);
    });
  }

  updateForm(eventDetails: EventDetails) {
    this.form.patchValue({
      id: eventDetails.id,
      totalEntranceFee: eventDetails.totalEntranceFee,
    });
  }

  save() {
    this.isSaving = true;
    const eventDetails = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventDetailsService.update(eventDetails));
    } else {
      this.subscribeToSaveResponse(this.eventDetailsService.create(eventDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventDetails>>) {
    result.subscribe(
      (res: HttpResponse<EventDetails>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `EventDetails ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-details');
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

  private createFromForm(): EventDetails {
    return {
      ...new EventDetails(),
      id: this.form.get(['id']).value,
      totalEntranceFee: this.form.get(['totalEntranceFee']).value,
    };
  }

  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
}
