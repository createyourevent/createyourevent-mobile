import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Hotel } from './hotel.model';
import { HotelService } from './hotel.service';
import { Organization, OrganizationService } from '../organization';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-hotel-update',
  templateUrl: 'hotel-update.html',
})
export class HotelUpdatePage implements OnInit {
  hotel: Hotel;
  organizations: Organization[];
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    menu: [null, []],
    placesToSleep: [null, []],
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
    private hotelService: HotelService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.organizationService.query({ filter: 'hotel-is-null' }).subscribe(
      (data) => {
        if (!this.hotel.organization || !this.hotel.organization.id) {
          this.organizations = data.body;
        } else {
          this.organizationService.find(this.hotel.organization.id).subscribe(
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
      this.hotel = response.data;
      this.isNew = this.hotel.id === null || this.hotel.id === undefined;
      this.updateForm(this.hotel);
    });
  }

  updateForm(hotel: Hotel) {
    this.form.patchValue({
      id: hotel.id,
      menu: hotel.menu,
      placesToSleep: hotel.placesToSleep,
      organization: hotel.organization,
      user: hotel.user,
    });
  }

  save() {
    this.isSaving = true;
    const hotel = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.hotelService.update(hotel));
    } else {
      this.subscribeToSaveResponse(this.hotelService.create(hotel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Hotel>>) {
    result.subscribe(
      (res: HttpResponse<Hotel>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Hotel ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/hotel');
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

  private createFromForm(): Hotel {
    return {
      ...new Hotel(),
      id: this.form.get(['id']).value,
      menu: this.form.get(['menu']).value,
      placesToSleep: this.form.get(['placesToSleep']).value,
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
