import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventLikeDislike } from './event-like-dislike.model';
import { EventLikeDislikeService } from './event-like-dislike.service';
import { Event, EventService } from '../event';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-event-like-dislike-update',
  templateUrl: 'event-like-dislike-update.html',
})
export class EventLikeDislikeUpdatePage implements OnInit {
  eventLikeDislike: EventLikeDislike;
  events: Event[];
  users: User[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    like: [null, []],
    dislike: [null, []],
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
    private eventLikeDislikeService: EventLikeDislikeService
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
      this.eventLikeDislike = response.data;
      this.isNew = this.eventLikeDislike.id === null || this.eventLikeDislike.id === undefined;
      this.updateForm(this.eventLikeDislike);
    });
  }

  updateForm(eventLikeDislike: EventLikeDislike) {
    this.form.patchValue({
      id: eventLikeDislike.id,
      like: eventLikeDislike.like,
      dislike: eventLikeDislike.dislike,
      date: this.isNew ? new Date().toISOString() : eventLikeDislike.date,
      comment: eventLikeDislike.comment,
      event: eventLikeDislike.event,
      user: eventLikeDislike.user,
    });
  }

  save() {
    this.isSaving = true;
    const eventLikeDislike = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventLikeDislikeService.update(eventLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.eventLikeDislikeService.create(eventLikeDislike));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventLikeDislike>>) {
    result.subscribe(
      (res: HttpResponse<EventLikeDislike>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `EventLikeDislike ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-like-dislike');
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

  private createFromForm(): EventLikeDislike {
    return {
      ...new EventLikeDislike(),
      id: this.form.get(['id']).value,
      like: this.form.get(['like']).value,
      dislike: this.form.get(['dislike']).value,
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
