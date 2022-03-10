import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RideCosts } from './ride-costs.model';
import { RideCostsService } from './ride-costs.service';
import { ServiceMap, ServiceMapService } from '../service-map';

@Component({
  selector: 'page-ride-costs-update',
  templateUrl: 'ride-costs-update.html',
})
export class RideCostsUpdatePage implements OnInit {
  rideCosts: RideCosts;
  serviceMaps: ServiceMap[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    pricePerKilometre: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceMapService: ServiceMapService,
    private rideCostsService: RideCostsService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.serviceMapService.query().subscribe(
      (data) => {
        this.serviceMaps = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.rideCosts = response.data;
      this.isNew = this.rideCosts.id === null || this.rideCosts.id === undefined;
      this.updateForm(this.rideCosts);
    });
  }

  updateForm(rideCosts: RideCosts) {
    this.form.patchValue({
      id: rideCosts.id,
      pricePerKilometre: rideCosts.pricePerKilometre,
    });
  }

  save() {
    this.isSaving = true;
    const rideCosts = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.rideCostsService.update(rideCosts));
    } else {
      this.subscribeToSaveResponse(this.rideCostsService.create(rideCosts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<RideCosts>>) {
    result.subscribe(
      (res: HttpResponse<RideCosts>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `RideCosts ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/ride-costs');
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

  private createFromForm(): RideCosts {
    return {
      ...new RideCosts(),
      id: this.form.get(['id']).value,
      pricePerKilometre: this.form.get(['pricePerKilometre']).value,
    };
  }

  compareServiceMap(first: ServiceMap, second: ServiceMap): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceMapById(index: number, item: ServiceMap) {
    return item.id;
  }
}
