import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';

@Component({
  selector: 'page-partner-update',
  templateUrl: 'partner-update.html',
})
export class PartnerUpdatePage implements OnInit {
  partner: Partner;
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    address: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    logo: [null, [Validators.required]],
    logoContentType: [null, []],
    mail: [null, [Validators.required]],
    webaddress: [null, [Validators.required]],
    sponsorshipAmount: [null, []],
    active: ['false', []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,

    private elementRef: ElementRef,
    private camera: Camera,
    private partnerService: PartnerService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    // Set the Camera options
    this.cameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 1,
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.partner = response.data;
      this.isNew = this.partner.id === null || this.partner.id === undefined;
      this.updateForm(this.partner);
    });
  }

  updateForm(partner: Partner) {
    this.form.patchValue({
      id: partner.id,
      name: partner.name,
      address: partner.address,
      phone: partner.phone,
      logo: partner.logo,
      logoContentType: partner.logoContentType,
      mail: partner.mail,
      webaddress: partner.webaddress,
      sponsorshipAmount: partner.sponsorshipAmount,
      active: partner.active,
    });
  }

  save() {
    this.isSaving = true;
    const partner = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.partnerService.update(partner));
    } else {
      this.subscribeToSaveResponse(this.partnerService.create(partner));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Partner>>) {
    result.subscribe(
      (res: HttpResponse<Partner>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Partner ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/partner');
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

  private createFromForm(): Partner {
    return {
      ...new Partner(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      address: this.form.get(['address']).value,
      phone: this.form.get(['phone']).value,
      logo: this.form.get(['logo']).value,
      logoContentType: this.form.get(['logoContentType']).value,
      mail: this.form.get(['mail']).value,
      webaddress: this.form.get(['webaddress']).value,
      sponsorshipAmount: this.form.get(['sponsorshipAmount']).value,
      active: this.form.get(['active']).value,
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
    this.processWebImage(event, field);
  }

  getPicture(fieldName) {
    if (Camera.installed()) {
      this.camera.getPicture(this.cameraOptions).then(
        (data) => {
          this.partner[fieldName] = data;
          this.partner[fieldName + 'ContentType'] = 'image/jpeg';
          this.form.patchValue({ [fieldName]: data });
          this.form.patchValue({ [fieldName + 'ContentType']: 'image/jpeg' });
        },
        (err) => {
          alert('Unable to take photo');
        }
      );
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event, fieldName) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      const imageType = event.target.files[0].type;
      imageData = imageData.substring(imageData.indexOf(',') + 1);

      this.form.patchValue({ [fieldName]: imageData });
      this.form.patchValue({ [fieldName + 'ContentType']: imageType });
      this.partner[fieldName] = imageData;
      this.partner[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.partner, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
}
