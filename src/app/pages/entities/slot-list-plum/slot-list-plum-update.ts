import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SlotListPlum } from './slot-list-plum.model';
import { SlotListPlumService } from './slot-list-plum.service';

@Component({
  selector: 'page-slot-list-plum-update',
  templateUrl: 'slot-list-plum-update.html',
})
export class SlotListPlumUpdatePage implements OnInit {
  slotListPlum: SlotListPlum;
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
    private slotListPlumService: SlotListPlumService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListPlum = response.data;
      this.isNew = this.slotListPlum.id === null || this.slotListPlum.id === undefined;
      this.updateForm(this.slotListPlum);
    });
  }

  updateForm(slotListPlum: SlotListPlum) {
    this.form.patchValue({
      id: slotListPlum.id,
      coupons: slotListPlum.coupons,
    });
  }

  save() {
    this.isSaving = true;
    const slotListPlum = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.slotListPlumService.update(slotListPlum));
    } else {
      this.subscribeToSaveResponse(this.slotListPlumService.create(slotListPlum));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SlotListPlum>>) {
    result.subscribe(
      (res: HttpResponse<SlotListPlum>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `SlotListPlum ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/slot-list-plum');
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

  private createFromForm(): SlotListPlum {
    return {
      ...new SlotListPlum(),
      id: this.form.get(['id']).value,
      coupons: this.form.get(['coupons']).value,
    };
  }
}
