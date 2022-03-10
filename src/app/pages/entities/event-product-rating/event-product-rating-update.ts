import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventProductRating } from './event-product-rating.model';
import { EventProductRatingService } from './event-product-rating.service';
import { Product, ProductService } from '../product';
import { Event, EventService } from '../event';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-event-product-rating-update',
  templateUrl: 'event-product-rating-update.html',
})
export class EventProductRatingUpdatePage implements OnInit {
  eventProductRating: EventProductRating;
  products: Product[];
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
    product: [null, []],
    event: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private eventService: EventService,
    private userService: UserService,
    private eventProductRatingService: EventProductRatingService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.productService.query().subscribe(
      (data) => {
        this.products = data.body;
      },
      (error) => this.onError(error)
    );
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
      this.eventProductRating = response.data;
      this.isNew = this.eventProductRating.id === null || this.eventProductRating.id === undefined;
      this.updateForm(this.eventProductRating);
    });
  }

  updateForm(eventProductRating: EventProductRating) {
    this.form.patchValue({
      id: eventProductRating.id,
      like: eventProductRating.like,
      dislike: eventProductRating.dislike,
      date: this.isNew ? new Date().toISOString() : eventProductRating.date,
      comment: eventProductRating.comment,
      product: eventProductRating.product,
      event: eventProductRating.event,
      user: eventProductRating.user,
    });
  }

  save() {
    this.isSaving = true;
    const eventProductRating = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventProductRatingService.update(eventProductRating));
    } else {
      this.subscribeToSaveResponse(this.eventProductRatingService.create(eventProductRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EventProductRating>>) {
    result.subscribe(
      (res: HttpResponse<EventProductRating>) => this.onSaveSuccess(res),
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
      message: `EventProductRating ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event-product-rating');
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

  private createFromForm(): EventProductRating {
    return {
      ...new EventProductRating(),
      id: this.form.get(['id']).value,
      like: this.form.get(['like']).value,
      dislike: this.form.get(['dislike']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
      product: this.form.get(['product']).value,
      event: this.form.get(['event']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
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
