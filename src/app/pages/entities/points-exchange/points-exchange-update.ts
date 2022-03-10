import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PointsExchange } from './points-exchange.model';
import { PointsExchangeService } from './points-exchange.service';

@Component({
  selector: 'page-points-exchange-update',
  templateUrl: 'points-exchange-update.html',
})
export class PointsExchangeUpdatePage implements OnInit {
  pointsExchange: PointsExchange;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    pointsTotal: [null, []],
    bondPointsTotal: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private pointsExchangeService: PointsExchangeService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.pointsExchange = response.data;
      this.isNew = this.pointsExchange.id === null || this.pointsExchange.id === undefined;
      this.updateForm(this.pointsExchange);
    });
  }

  updateForm(pointsExchange: PointsExchange) {
    this.form.patchValue({
      id: pointsExchange.id,
      pointsTotal: pointsExchange.pointsTotal,
      bondPointsTotal: pointsExchange.bondPointsTotal,
    });
  }

  save() {
    this.isSaving = true;
    const pointsExchange = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.pointsExchangeService.update(pointsExchange));
    } else {
      this.subscribeToSaveResponse(this.pointsExchangeService.create(pointsExchange));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PointsExchange>>) {
    result.subscribe(
      (res: HttpResponse<PointsExchange>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `PointsExchange ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/points-exchange');
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

  private createFromForm(): PointsExchange {
    return {
      ...new PointsExchange(),
      id: this.form.get(['id']).value,
      pointsTotal: this.form.get(['pointsTotal']).value,
      bondPointsTotal: this.form.get(['bondPointsTotal']).value,
    };
  }
}
