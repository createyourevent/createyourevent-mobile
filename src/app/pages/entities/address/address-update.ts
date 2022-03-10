import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Address } from './address.model';
import { AddressService } from './address.service';
import { Location, LocationService } from '../location';

@Component({
  selector: 'page-address-update',
  templateUrl: 'address-update.html',
})
export class AddressUpdatePage implements OnInit {
  address: Address;
  locations: Location[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    address: [null, []],
    lat: [null, []],
    lng: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private locationService: LocationService,
    private addressService: AddressService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.locationService.query().subscribe(
      (data) => {
        this.locations = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.address = response.data;
      this.isNew = this.address.id === null || this.address.id === undefined;
      this.updateForm(this.address);
    });
  }

  updateForm(address: Address) {
    this.form.patchValue({
      id: address.id,
      address: address.address,
      lat: address.lat,
      lng: address.lng,
    });
  }

  save() {
    this.isSaving = true;
    const address = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Address>>) {
    result.subscribe(
      (res: HttpResponse<Address>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Address ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/address');
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

  private createFromForm(): Address {
    return {
      ...new Address(),
      id: this.form.get(['id']).value,
      address: this.form.get(['address']).value,
      lat: this.form.get(['lat']).value,
      lng: this.form.get(['lng']).value,
    };
  }

  compareLocation(first: Location, second: Location): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackLocationById(index: number, item: Location) {
    return item.id;
  }
}
