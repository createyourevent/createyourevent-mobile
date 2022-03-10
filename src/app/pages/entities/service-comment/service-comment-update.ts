import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceComment } from './service-comment.model';
import { ServiceCommentService } from './service-comment.service';
import { CreateYourEventService, CreateYourEventServiceService } from '../create-your-event-service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-service-comment-update',
  templateUrl: 'service-comment-update.html',
})
export class ServiceCommentUpdatePage implements OnInit {
  serviceComment: ServiceComment;
  createYourEventServices: CreateYourEventService[];
  users: User[];
  serviceComments: ServiceComment[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    comment: [null, []],
    date: [null, []],
    createYourEventService: [null, []],
    user: [null, []],
    serviceComment: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private createYourEventServiceService: CreateYourEventServiceService,
    private userService: UserService,
    private serviceCommentService: ServiceCommentService
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
    this.serviceCommentService.query().subscribe(
      (data) => {
        this.serviceComments = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.serviceComment = response.data;
      this.isNew = this.serviceComment.id === null || this.serviceComment.id === undefined;
      this.updateForm(this.serviceComment);
    });
  }

  updateForm(serviceComment: ServiceComment) {
    this.form.patchValue({
      id: serviceComment.id,
      comment: serviceComment.comment,
      date: this.isNew ? new Date().toISOString() : serviceComment.date,
      createYourEventService: serviceComment.createYourEventService,
      user: serviceComment.user,
      serviceComment: serviceComment.serviceComment,
    });
  }

  save() {
    this.isSaving = true;
    const serviceComment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceCommentService.update(serviceComment));
    } else {
      this.subscribeToSaveResponse(this.serviceCommentService.create(serviceComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceComment>>) {
    result.subscribe(
      (res: HttpResponse<ServiceComment>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ServiceComment ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/service-comment');
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

  private createFromForm(): ServiceComment {
    return {
      ...new ServiceComment(),
      id: this.form.get(['id']).value,
      comment: this.form.get(['comment']).value,
      date: new Date(this.form.get(['date']).value),
      createYourEventService: this.form.get(['createYourEventService']).value,
      user: this.form.get(['user']).value,
      serviceComment: this.form.get(['serviceComment']).value,
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
  compareServiceComment(first: ServiceComment, second: ServiceComment): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceCommentById(index: number, item: ServiceComment) {
    return item.id;
  }
}
