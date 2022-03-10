import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminFeesPrice } from './admin-fees-price.model';
import { AdminFeesPriceService } from './admin-fees-price.service';

@Component({
  selector: 'page-admin-fees-price-update',
  templateUrl: 'admin-fees-price-update.html',
})
export class AdminFeesPriceUpdatePage implements OnInit {
  adminFeesPrice: AdminFeesPrice;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    feesOrganisator: [null, []],
    feesSupplier: [null, []],
    feesService: [null, []],
    feesOrganizations: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private adminFeesPriceService: AdminFeesPriceService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.adminFeesPrice = response.data;
      this.isNew = this.adminFeesPrice.id === null || this.adminFeesPrice.id === undefined;
      this.updateForm(this.adminFeesPrice);
    });
  }

  updateForm(adminFeesPrice: AdminFeesPrice) {
    this.form.patchValue({
      id: adminFeesPrice.id,
      feesOrganisator: adminFeesPrice.feesOrganisator,
      feesSupplier: adminFeesPrice.feesSupplier,
      feesService: adminFeesPrice.feesService,
      feesOrganizations: adminFeesPrice.feesOrganizations,
    });
  }

  save() {
    this.isSaving = true;
    const adminFeesPrice = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.adminFeesPriceService.update(adminFeesPrice));
    } else {
      this.subscribeToSaveResponse(this.adminFeesPriceService.create(adminFeesPrice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AdminFeesPrice>>) {
    result.subscribe(
      (res: HttpResponse<AdminFeesPrice>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `AdminFeesPrice ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/admin-fees-price');
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

  private createFromForm(): AdminFeesPrice {
    return {
      ...new AdminFeesPrice(),
      id: this.form.get(['id']).value,
      feesOrganisator: this.form.get(['feesOrganisator']).value,
      feesSupplier: this.form.get(['feesSupplier']).value,
      feesService: this.form.get(['feesService']).value,
      feesOrganizations: this.form.get(['feesOrganizations']).value,
    };
  }
}
