import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SlotListClock } from './slot-list-clock.model';
import { SlotListClockService } from './slot-list-clock.service';

@Component({
  selector: 'page-slot-list-clock-update',
  templateUrl: 'slot-list-clock-update.html',
})
export class SlotListClockUpdatePage implements OnInit {
  slotListClock: SlotListClock;
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
    private slotListClockService: SlotListClockService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListClock = response.data;
      this.isNew = this.slotListClock.id === null || this.slotListClock.id === undefined;
      this.updateForm(this.slotListClock);
    });
  }

  updateForm(slotListClock: SlotListClock) {
    this.form.patchValue({
      id: slotListClock.id,
      coupons: slotListClock.coupons,
    });
  }

  save() {
    this.isSaving = true;
    const slotListClock = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.slotListClockService.update(slotListClock));
    } else {
      this.subscribeToSaveResponse(this.slotListClockService.create(slotListClock));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SlotListClock>>) {
    result.subscribe(
      (res: HttpResponse<SlotListClock>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `SlotListClock ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/slot-list-clock');
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

  private createFromForm(): SlotListClock {
    return {
      ...new SlotListClock(),
      id: this.form.get(['id']).value,
      coupons: this.form.get(['coupons']).value,
    };
  }
}
