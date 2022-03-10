import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Club } from './club.model';
import { ClubService } from './club.service';
import { Organization, OrganizationService } from '../organization';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-club-update',
  templateUrl: 'club-update.html',
})
export class ClubUpdatePage implements OnInit {
  club: Club;
  organizations: Organization[];
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    priceCard: [null, []],
    organization: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private organizationService: OrganizationService,
    private userService: UserService,
    private clubService: ClubService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.organizationService.query({ filter: 'club-is-null' }).subscribe(
      (data) => {
        if (!this.club.organization || !this.club.organization.id) {
          this.organizations = data.body;
        } else {
          this.organizationService.find(this.club.organization.id).subscribe(
            (subData: HttpResponse<Organization>) => {
              this.organizations = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.club = response.data;
      this.isNew = this.club.id === null || this.club.id === undefined;
      this.updateForm(this.club);
    });
  }

  updateForm(club: Club) {
    this.form.patchValue({
      id: club.id,
      priceCard: club.priceCard,
      organization: club.organization,
      user: club.user,
    });
  }

  save() {
    this.isSaving = true;
    const club = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.clubService.update(club));
    } else {
      this.subscribeToSaveResponse(this.clubService.create(club));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Club>>) {
    result.subscribe(
      (res: HttpResponse<Club>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Club ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/club');
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

  private createFromForm(): Club {
    return {
      ...new Club(),
      id: this.form.get(['id']).value,
      priceCard: this.form.get(['priceCard']).value,
      organization: this.form.get(['organization']).value,
      user: this.form.get(['user']).value,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
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
