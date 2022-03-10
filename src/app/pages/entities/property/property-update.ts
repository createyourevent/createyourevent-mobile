import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Property } from './property.model';
import { PropertyService } from './property.service';

@Component({
  selector: 'page-property-update',
  templateUrl: 'property-update.html',
})
export class PropertyUpdatePage implements OnInit {
  property: Property;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    key: [null, []],
    value: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private propertyService: PropertyService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.property = response.data;
      this.isNew = this.property.id === null || this.property.id === undefined;
      this.updateForm(this.property);
    });
  }

  updateForm(property: Property) {
    this.form.patchValue({
      id: property.id,
      key: property.key,
      value: property.value,
    });
  }

  save() {
    this.isSaving = true;
    const property = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.propertyService.update(property));
    } else {
      this.subscribeToSaveResponse(this.propertyService.create(property));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Property>>) {
    result.subscribe(
      (res: HttpResponse<Property>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Property ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/property');
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

  private createFromForm(): Property {
    return {
      ...new Property(),
      id: this.form.get(['id']).value,
      key: this.form.get(['key']).value,
      value: this.form.get(['value']).value,
    };
  }
}
