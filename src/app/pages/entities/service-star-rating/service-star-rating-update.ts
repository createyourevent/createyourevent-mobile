import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceStarRating } from './service-star-rating.model';
import { ServiceStarRatingService } from './service-star-rating.service';
import { CreateYourEventService, CreateYourEventServiceService } from '../create-your-event-service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-service-star-rating-update',
  templateUrl: 'service-star-rating-update.html',
})
export class ServiceStarRatingUpdatePage implements OnInit {
  serviceStarRating: ServiceStarRating;
  createYourEventServices: CreateYourEventService[];
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
    service: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private createYourEventServiceService: CreateYourEventServiceService,
    private userService: UserService,
    private serviceStarRatingService: ServiceStarRatingService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.createYourEventServiceService.query().subscribe(
      (data) => {
        this.createYourEventServices = data.body;
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.serviceStarRating = response.data;
      this.isNew = this.serviceStarRating.id === null || this.serviceStarRating.id === undefined;
      this.updateForm(this.serviceStarRating);
    });
  }

  updateForm(serviceStarRating: ServiceStarRating) {
    this.form.patchValue({
      id: serviceStarRating.id,
      stars: serviceStarRating.stars,
      date: this.isNew ? new Date().toISOString() : serviceStarRating.date,
      comment: serviceStarRating.comment,
      service: serviceStarRating.service,
      user: serviceStarRating.user,
    });
  }

  save() {
    this.isSaving = true;
    const serviceStarRating = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceStarRatingService.update(serviceStarRating));
    } else {
      this.subscribeToSaveResponse(this.serviceStarRatingService.create(serviceStarRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceStarRating>>) {
    result.subscribe(
      (res: HttpResponse<ServiceStarRating>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ServiceStarRating ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/service-star-rating');
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

  private createFromForm(): ServiceStarRating {
    return {
      ...new ServiceStarRating(),
      id: this.form.get(['id']).value,
      stars: this.form.get(['stars']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
      service: this.form.get(['service']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareCreateYourEventService(first: CreateYourEventService, second: CreateYourEventService): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCreateYourEventServiceById(index: number, item: CreateYourEventService) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
