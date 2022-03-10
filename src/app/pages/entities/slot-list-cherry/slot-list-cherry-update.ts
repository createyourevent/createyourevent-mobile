import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SlotListCherry } from './slot-list-cherry.model';
import { SlotListCherryService } from './slot-list-cherry.service';

@Component({
  selector: 'page-slot-list-cherry-update',
  templateUrl: 'slot-list-cherry-update.html',
})
export class SlotListCherryUpdatePage implements OnInit {
  slotListCherry: SlotListCherry;
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
    private slotListCherryService: SlotListCherryService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListCherry = response.data;
      this.isNew = this.slotListCherry.id === null || this.slotListCherry.id === undefined;
      this.updateForm(this.slotListCherry);
    });
  }

  updateForm(slotListCherry: SlotListCherry) {
    this.form.patchValue({
      id: slotListCherry.id,
      coupons: slotListCherry.coupons,
    });
  }

  save() {
    this.isSaving = true;
    const slotListCherry = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.slotListCherryService.update(slotListCherry));
    } else {
      this.subscribeToSaveResponse(this.slotListCherryService.create(slotListCherry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SlotListCherry>>) {
    result.subscribe(
      (res: HttpResponse<SlotListCherry>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `SlotListCherry ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/slot-list-cherry');
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

  private createFromForm(): SlotListCherry {
    return {
      ...new SlotListCherry(),
      id: this.form.get(['id']).value,
      coupons: this.form.get(['coupons']).value,
    };
  }
}
