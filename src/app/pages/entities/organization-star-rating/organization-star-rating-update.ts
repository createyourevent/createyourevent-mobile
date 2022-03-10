import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationStarRating } from './organization-star-rating.model';
import { OrganizationStarRatingService } from './organization-star-rating.service';
import { Organization, OrganizationService } from '../organization';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-organization-star-rating-update',
  templateUrl: 'organization-star-rating-update.html',
})
export class OrganizationStarRatingUpdatePage implements OnInit {
  organizationStarRating: OrganizationStarRating;
  organizations: Organization[];
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
    organization: [null, []],
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
    private organizationStarRatingService: OrganizationStarRatingService
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
      this.organizationStarRating = response.data;
      this.isNew = this.organizationStarRating.id === null || this.organizationStarRating.id === undefined;
      this.updateForm(this.organizationStarRating);
    });
  }

  updateForm(organizationStarRating: OrganizationStarRating) {
    this.form.patchValue({
      id: organizationStarRating.id,
      stars: organizationStarRating.stars,
      date: this.isNew ? new Date().toISOString() : organizationStarRating.date,
      comment: organizationStarRating.comment,
      organization: organizationStarRating.organization,
      user: organizationStarRating.user,
    });
  }

  save() {
    this.isSaving = true;
    const organizationStarRating = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.organizationStarRatingService.update(organizationStarRating));
    } else {
      this.subscribeToSaveResponse(this.organizationStarRatingService.create(organizationStarRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrganizationStarRating>>) {
    result.subscribe(
      (res: HttpResponse<OrganizationStarRating>) => this.onSaveSuccess(res),
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
      message: `OrganizationStarRating ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/organization-star-rating');
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

  private createFromForm(): OrganizationStarRating {
    return {
      ...new OrganizationStarRating(),
      id: this.form.get(['id']).value,
      stars: this.form.get(['stars']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
      organization: this.form.get(['organization']).value,
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
