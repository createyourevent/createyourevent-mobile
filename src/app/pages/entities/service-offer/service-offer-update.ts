import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceOffer } from './service-offer.model';
import { ServiceOfferService } from './service-offer.service';
import { ServiceMap, ServiceMapService } from '../service-map';

@Component({
  selector: 'page-service-offer-update',
  templateUrl: 'service-offer-update.html',
})
export class ServiceOfferUpdatePage implements OnInit {
  serviceOffer: ServiceOffer;
  serviceMaps: ServiceMap[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    costHour: [null, [Validators.required]],
    serviceMaps: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private serviceMapService: ServiceMapService,
    private serviceOfferService: ServiceOfferService
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
      this.serviceOffer = response.data;
      this.isNew = this.serviceOffer.id === null || this.serviceOffer.id === undefined;
      this.updateForm(this.serviceOffer);
    });
  }

  updateForm(serviceOffer: ServiceOffer) {
    this.form.patchValue({
      id: serviceOffer.id,
      title: serviceOffer.title,
      description: serviceOffer.description,
      costHour: serviceOffer.costHour,
      serviceMaps: serviceOffer.serviceMaps,
    });
  }

  save() {
    this.isSaving = true;
    const serviceOffer = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceOfferService.update(serviceOffer));
    } else {
      this.subscribeToSaveResponse(this.serviceOfferService.create(serviceOffer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceOffer>>) {
    result.subscribe(
      (res: HttpResponse<ServiceOffer>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ServiceOffer ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/service-offer');
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

  private createFromForm(): ServiceOffer {
    return {
      ...new ServiceOffer(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      description: this.form.get(['description']).value,
      costHour: this.form.get(['costHour']).value,
      serviceMaps: this.form.get(['serviceMaps']).value,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
  }

  compareServiceMap(first: ServiceMap, second: ServiceMap): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceMapById(index: number, item: ServiceMap) {
    return item.id;
  }
}
