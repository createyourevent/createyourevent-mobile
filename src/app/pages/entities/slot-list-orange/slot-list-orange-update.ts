import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SlotListOrange } from './slot-list-orange.model';
import { SlotListOrangeService } from './slot-list-orange.service';

@Component({
  selector: 'page-slot-list-orange-update',
  templateUrl: 'slot-list-orange-update.html',
})
export class SlotListOrangeUpdatePage implements OnInit {
  slotListOrange: SlotListOrange;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    coupons: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private slotListOrangeService: SlotListOrangeService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListOrange = response.data;
      this.isNew = this.slotListOrange.id === null || this.slotListOrange.id === undefined;
      this.updateForm(this.slotListOrange);
    });
  }

  updateForm(slotListOrange: SlotListOrange) {
    this.form.patchValue({
      id: slotListOrange.id,
      coupons: slotListOrange.coupons,
    });
  }

  save() {
    this.isSaving = true;
    const slotListOrange = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.slotListOrangeService.update(slotListOrange));
    } else {
      this.subscribeToSaveResponse(this.slotListOrangeService.create(slotListOrange));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SlotListOrange>>) {
    result.subscribe(
      (res: HttpResponse<SlotListOrange>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `SlotListOrange ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/slot-list-orange');
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

  private createFromForm(): SlotListOrange {
    return {
      ...new SlotListOrange(),
      id: this.form.get(['id']).value,
      coupons: this.form.get(['coupons']).value,
    };
  }
}
