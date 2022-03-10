import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventStarRating } from './event-star-rating.model';
import { EventStarRatingService } from './event-star-rating.service';
import { Event, EventService } from '../event';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-event-star-rating-update',
  templateUrl: 'event-star-rating-update.html',
})
export class EventStarRatingUpdatePage implements OnInit {
  eventStarRating: EventStarRating;
  events: Event[];
  users: User[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    stars: [null, []],
    date: [null, []],
    comment: [null, []],
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
    private eventStarRatingService: EventStarRatingService
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
    this.activatedRoute.data.subscribe((response) => {
      this.eventStarRating = response.data;
      this.isNew = this.eventStarRating.id === null || this.eventStarRating.id === undefined;
      this.updateForm(this.eventStarRating);
    });
  }

  updateForm(eventStarRating: EventStarRating) {
    this.form.patchValue({
      id: eventStarRating.id,
      stars: eventStarRating.stars,
      date: this.isNew ? new Date().toISOString() : eventStarRating.date,
      comment: eventStarRating.comment,
      event: eventStarRating.event,
      user: eventStarRating.user,
    });
  }

  save() {
    this.isSaving = true;
    const eventStarRating = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventStarRatingService.update(eventStarRating));
    } else {
      this.subscribeToSaveResponse(this.eventStarRatingService.create(eventStarRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventStarRating>>) {
    result.subscribe(
      (res: HttpResponse<EventStarRating>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `EventStarRating ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-star-rating');
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

  private createFromForm(): EventStarRating {
    return {
      ...new EventStarRating(),
      id: this.form.get(['id']).value,
      stars: this.form.get(['stars']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
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
}
