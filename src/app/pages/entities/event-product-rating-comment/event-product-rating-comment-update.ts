import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventProductRatingComment } from './event-product-rating-comment.model';
import { EventProductRatingCommentService } from './event-product-rating-comment.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Event, EventService } from '../event';
import { Product, ProductService } from '../product';

@Component({
  selector: 'page-event-product-rating-comment-update',
  templateUrl: 'event-product-rating-comment-update.html',
})
export class EventProductRatingCommentUpdatePage implements OnInit {
  eventProductRatingComment: EventProductRatingComment;
  users: User[];
  events: Event[];
  products: Product[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    comment: [null, []],
    date: [null, []],
    user: [null, []],
    event: [null, []],
    product: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private eventService: EventService,
    private productService: ProductService,
    private eventProductRatingCommentService: EventProductRatingCommentService
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
    this.productService.query().subscribe(
      (data) => {
        this.products = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.eventProductRatingComment = response.data;
      this.isNew = this.eventProductRatingComment.id === null || this.eventProductRatingComment.id === undefined;
      this.updateForm(this.eventProductRatingComment);
    });
  }

  updateForm(eventProductRatingComment: EventProductRatingComment) {
    this.form.patchValue({
      id: eventProductRatingComment.id,
      comment: eventProductRatingComment.comment,
      date: this.isNew ? new Date().toISOString() : eventProductRatingComment.date,
      user: eventProductRatingComment.user,
      event: eventProductRatingComment.event,
      product: eventProductRatingComment.product,
    });
  }

  save() {
    this.isSaving = true;
    const eventProductRatingComment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventProductRatingCommentService.update(eventProductRatingComment));
    } else {
      this.subscribeToSaveResponse(this.eventProductRatingCommentService.create(eventProductRatingComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventProductRatingComment>>) {
    result.subscribe(
      (res: HttpResponse<EventProductRatingComment>) => this.onSaveSuccess(res),
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
      message: `EventProductRatingComment ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-product-rating-comment');
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

  private createFromForm(): EventProductRatingComment {
    return {
      ...new EventProductRatingComment(),
      id: this.form.get(['id']).value,
      comment: this.form.get(['comment']).value,
      date: new Date(this.form.get(['date']).value),
      user: this.form.get(['user']).value,
      event: this.form.get(['event']).value,
      product: this.form.get(['product']).value,
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
  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
}
