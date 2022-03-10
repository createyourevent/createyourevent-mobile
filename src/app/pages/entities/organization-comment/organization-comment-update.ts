import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationComment } from './organization-comment.model';
import { OrganizationCommentService } from './organization-comment.service';
import { Organization, OrganizationService } from '../organization';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-organization-comment-update',
  templateUrl: 'organization-comment-update.html',
})
export class OrganizationCommentUpdatePage implements OnInit {
  organizationComment: OrganizationComment;
  organizations: Organization[];
  users: User[];
  organizationComments: OrganizationComment[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    comment: [null, []],
    date: [null, []],
    organization: [null, []],
    user: [null, []],
    event: [null, []],
    organizationComment: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private organizationService: OrganizationService,
    private userService: UserService,
    private organizationCommentService: OrganizationCommentService
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
    this.organizationCommentService.query().subscribe(
      (data) => {
        this.organizationComments = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.organizationComment = response.data;
      this.isNew = this.organizationComment.id === null || this.organizationComment.id === undefined;
      this.updateForm(this.organizationComment);
    });
  }

  updateForm(organizationComment: OrganizationComment) {
    this.form.patchValue({
      id: organizationComment.id,
      comment: organizationComment.comment,
      date: this.isNew ? new Date().toISOString() : organizationComment.date,
      organization: organizationComment.organization,
      user: organizationComment.user,
      event: organizationComment.event,
      organizationComment: organizationComment.organizationComment,
    });
  }

  save() {
    this.isSaving = true;
    const organizationComment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.organizationCommentService.update(organizationComment));
    } else {
      this.subscribeToSaveResponse(this.organizationCommentService.create(organizationComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrganizationComment>>) {
    result.subscribe(
      (res: HttpResponse<OrganizationComment>) => this.onSaveSuccess(res),
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
      message: `OrganizationComment ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/organization-comment');
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

  private createFromForm(): OrganizationComment {
    return {
      ...new OrganizationComment(),
      id: this.form.get(['id']).value,
      comment: this.form.get(['comment']).value,
      date: new Date(this.form.get(['date']).value),
      organization: this.form.get(['organization']).value,
      user: this.form.get(['user']).value,
      event: this.form.get(['event']).value,
      organizationComment: this.form.get(['organizationComment']).value,
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
  compareOrganizationComment(first: OrganizationComment, second: OrganizationComment): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrganizationCommentById(index: number, item: OrganizationComment) {
    return item.id;
  }
}
