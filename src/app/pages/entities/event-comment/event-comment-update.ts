import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventComment } from './event-comment.model';
import { EventCommentService } from './event-comment.service';
import { Event, EventService } from '../event';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-event-comment-update',
  templateUrl: 'event-comment-update.html',
})
export class EventCommentUpdatePage implements OnInit {
  eventComment: EventComment;
  events: Event[];
  users: User[];
  eventComments: EventComment[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    comment: [null, []],
    date: [null, []],
    event: [null, []],
    user: [null, []],
    eventComment: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private eventService: EventService,
    private userService: UserService,
    private eventCommentService: EventCommentService
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
    this.eventCommentService.query().subscribe(
      (data) => {
        this.eventComments = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.eventComment = response.data;
      this.isNew = this.eventComment.id === null || this.eventComment.id === undefined;
      this.updateForm(this.eventComment);
    });
  }

  updateForm(eventComment: EventComment) {
    this.form.patchValue({
      id: eventComment.id,
      comment: eventComment.comment,
      date: this.isNew ? new Date().toISOString() : eventComment.date,
      event: eventComment.event,
      user: eventComment.user,
      eventComment: eventComment.eventComment,
    });
  }

  save() {
    this.isSaving = true;
    const eventComment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventCommentService.update(eventComment));
    } else {
      this.subscribeToSaveResponse(this.eventCommentService.create(eventComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventComment>>) {
    result.subscribe(
      (res: HttpResponse<EventComment>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `EventComment ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-comment');
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

  private createFromForm(): EventComment {
    return {
      ...new EventComment(),
      id: this.form.get(['id']).value,
      comment: this.form.get(['comment']).value,
      date: new Date(this.form.get(['date']).value),
      event: this.form.get(['event']).value,
      user: this.form.get(['user']).value,
      eventComment: this.form.get(['eventComment']).value,
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
  compareEventComment(first: EventComment, second: EventComment): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventCommentById(index: number, item: EventComment) {
    return item.id;
  }
}
