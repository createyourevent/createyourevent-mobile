import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { Organization, OrganizationService } from '../organization';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-restaurant-update',
  templateUrl: 'restaurant-update.html',
})
export class RestaurantUpdatePage implements OnInit {
  restaurant: Restaurant;
  organizations: Organization[];
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    menu: [null, []],
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
    private restaurantService: RestaurantService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.organizationService.query({ filter: 'restaurant-is-null' }).subscribe(
      (data) => {
        if (!this.restaurant.organization || !this.restaurant.organization.id) {
          this.organizations = data.body;
        } else {
          this.organizationService.find(this.restaurant.organization.id).subscribe(
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
      this.restaurant = response.data;
      this.isNew = this.restaurant.id === null || this.restaurant.id === undefined;
      this.updateForm(this.restaurant);
    });
  }

  updateForm(restaurant: Restaurant) {
    this.form.patchValue({
      id: restaurant.id,
      menu: restaurant.menu,
      organization: restaurant.organization,
      user: restaurant.user,
    });
  }

  save() {
    this.isSaving = true;
    const restaurant = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.restaurantService.update(restaurant));
    } else {
      this.subscribeToSaveResponse(this.restaurantService.create(restaurant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Restaurant>>) {
    result.subscribe(
      (res: HttpResponse<Restaurant>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Restaurant ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/restaurant');
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

  private createFromForm(): Restaurant {
    return {
      ...new Restaurant(),
      id: this.form.get(['id']).value,
      menu: this.form.get(['menu']).value,
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
