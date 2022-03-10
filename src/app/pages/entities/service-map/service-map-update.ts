import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceMap } from './service-map.model';
import { ServiceMapService } from './service-map.service';
import { RideCosts, RideCostsService } from '../ride-costs';
import { CreateYourEventService, CreateYourEventServiceService } from '../create-your-event-service';

@Component({
  selector: 'page-service-map-update',
  templateUrl: 'service-map-update.html',
})
export class ServiceMapUpdatePage implements OnInit {
  serviceMap: ServiceMap;
  rideCosts: RideCosts[];
  createYourEventServices: CreateYourEventService[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, [Validators.required]],
    rideCost: [null, []],
    createYourEventService: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private rideCostsService: RideCostsService,
    private createYourEventServiceService: CreateYourEventServiceService,
    private serviceMapService: ServiceMapService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.rideCostsService.query({ filter: 'servicemap-is-null' }).subscribe(
      (data) => {
        if (!this.serviceMap.rideCost || !this.serviceMap.rideCost.id) {
          this.rideCosts = data.body;
        } else {
          this.rideCostsService.find(this.serviceMap.rideCost.id).subscribe(
            (subData: HttpResponse<RideCosts>) => {
              this.rideCosts = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.createYourEventServiceService.query().subscribe(
      (data) => {
        this.createYourEventServices = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.serviceMap = response.data;
      this.isNew = this.serviceMap.id === null || this.serviceMap.id === undefined;
      this.updateForm(this.serviceMap);
    });
  }

  updateForm(serviceMap: ServiceMap) {
    this.form.patchValue({
      id: serviceMap.id,
      title: serviceMap.title,
      rideCost: serviceMap.rideCost,
      createYourEventService: serviceMap.createYourEventService,
    });
  }

  save() {
    this.isSaving = true;
    const serviceMap = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceMapService.update(serviceMap));
    } else {
      this.subscribeToSaveResponse(this.serviceMapService.create(serviceMap));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceMap>>) {
    result.subscribe(
      (res: HttpResponse<ServiceMap>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ServiceMap ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/service-map');
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

  private createFromForm(): ServiceMap {
    return {
      ...new ServiceMap(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      rideCost: this.form.get(['rideCost']).value,
      createYourEventService: this.form.get(['createYourEventService']).value,
    };
  }

  compareRideCosts(first: RideCosts, second: RideCosts): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackRideCostsById(index: number, item: RideCosts) {
    return item.id;
  }
  compareCreateYourEventService(first: CreateYourEventService, second: CreateYourEventService): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCreateYourEventServiceById(index: number, item: CreateYourEventService) {
    return item.id;
  }
}
