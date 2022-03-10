import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationLikeDislike } from './organization-like-dislike.model';
import { OrganizationLikeDislikeService } from './organization-like-dislike.service';
import { Organization, OrganizationService } from '../organization';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-organization-like-dislike-update',
  templateUrl: 'organization-like-dislike-update.html',
})
export class OrganizationLikeDislikeUpdatePage implements OnInit {
  organizationLikeDislike: OrganizationLikeDislike;
  organizations: Organization[];
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
    organization: [null, []],
    event: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private organizationService: OrganizationService,
    private userService: UserService,
    private organizationLikeDislikeService: OrganizationLikeDislikeService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.organizationService.query().subscribe(
      (data) => {
        this.organizations = data.body;
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.organizationLikeDislike = response.data;
      this.isNew = this.organizationLikeDislike.id === null || this.organizationLikeDislike.id === undefined;
      this.updateForm(this.organizationLikeDislike);
    });
  }

  updateForm(organizationLikeDislike: OrganizationLikeDislike) {
    this.form.patchValue({
      id: organizationLikeDislike.id,
      like: organizationLikeDislike.like,
      dislike: organizationLikeDislike.dislike,
      date: this.isNew ? new Date().toISOString() : organizationLikeDislike.date,
      comment: organizationLikeDislike.comment,
      organization: organizationLikeDislike.organization,
      event: organizationLikeDislike.event,
      user: organizationLikeDislike.user,
    });
  }

  save() {
    this.isSaving = true;
    const organizationLikeDislike = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.organizationLikeDislikeService.update(organizationLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.organizationLikeDislikeService.create(organizationLikeDislike));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrganizationLikeDislike>>) {
    result.subscribe(
      (res: HttpResponse<OrganizationLikeDislike>) => this.onSaveSuccess(res),
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
      message: `OrganizationLikeDislike ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/organization-like-dislike');
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

  private createFromForm(): OrganizationLikeDislike {
    return {
      ...new OrganizationLikeDislike(),
      id: this.form.get(['id']).value,
      like: this.form.get(['like']).value,
      dislike: this.form.get(['dislike']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
      organization: this.form.get(['organization']).value,
      event: this.form.get(['event']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareOrganization(first: Organization, second: Organization): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrganizationById(index: number, item: Organization) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
