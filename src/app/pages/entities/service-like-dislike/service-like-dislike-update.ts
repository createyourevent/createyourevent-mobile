import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceLikeDislike } from './service-like-dislike.model';
import { ServiceLikeDislikeService } from './service-like-dislike.service';
import { CreateYourEventService, CreateYourEventServiceService } from '../create-your-event-service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-service-like-dislike-update',
  templateUrl: 'service-like-dislike-update.html',
})
export class ServiceLikeDislikeUpdatePage implements OnInit {
  serviceLikeDislike: ServiceLikeDislike;
  createYourEventServices: CreateYourEventService[];
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
    createYourEventService: [null, []],
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
    private serviceLikeDislikeService: ServiceLikeDislikeService
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
      this.serviceLikeDislike = response.data;
      this.isNew = this.serviceLikeDislike.id === null || this.serviceLikeDislike.id === undefined;
      this.updateForm(this.serviceLikeDislike);
    });
  }

  updateForm(serviceLikeDislike: ServiceLikeDislike) {
    this.form.patchValue({
      id: serviceLikeDislike.id,
      like: serviceLikeDislike.like,
      dislike: serviceLikeDislike.dislike,
      date: this.isNew ? new Date().toISOString() : serviceLikeDislike.date,
      comment: serviceLikeDislike.comment,
      createYourEventService: serviceLikeDislike.createYourEventService,
      user: serviceLikeDislike.user,
    });
  }

  save() {
    this.isSaving = true;
    const serviceLikeDislike = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceLikeDislikeService.update(serviceLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.serviceLikeDislikeService.create(serviceLikeDislike));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceLikeDislike>>) {
    result.subscribe(
      (res: HttpResponse<ServiceLikeDislike>) => this.onSaveSuccess(res),
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
      message: `ServiceLikeDislike ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/service-like-dislike');
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

  private createFromForm(): ServiceLikeDislike {
    return {
      ...new ServiceLikeDislike(),
      id: this.form.get(['id']).value,
      like: this.form.get(['like']).value,
      dislike: this.form.get(['dislike']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
      createYourEventService: this.form.get(['createYourEventService']).value,
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
