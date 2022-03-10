import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Gift } from './gift.model';
import { GiftService } from './gift.service';

@Component({
  selector: 'page-gift-update',
  templateUrl: 'gift-update.html',
})
export class GiftUpdatePage implements OnInit {
  gift: Gift;
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    photo: [null, [Validators.required]],
    photoContentType: [null, []],
    points: [null, [Validators.required]],
    active: ['false', []],
    stock: [null, []],
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
    private giftService: GiftService
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
      this.gift = response.data;
      this.isNew = this.gift.id === null || this.gift.id === undefined;
      this.updateForm(this.gift);
    });
  }

  updateForm(gift: Gift) {
    this.form.patchValue({
      id: gift.id,
      title: gift.title,
      description: gift.description,
      photo: gift.photo,
      photoContentType: gift.photoContentType,
      points: gift.points,
      active: gift.active,
      stock: gift.stock,
    });
  }

  save() {
    this.isSaving = true;
    const gift = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.giftService.update(gift));
    } else {
      this.subscribeToSaveResponse(this.giftService.create(gift));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Gift>>) {
    result.subscribe(
      (res: HttpResponse<Gift>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Gift ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/gift');
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

  private createFromForm(): Gift {
    return {
      ...new Gift(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      description: this.form.get(['description']).value,
      photo: this.form.get(['photo']).value,
      photoContentType: this.form.get(['photoContentType']).value,
      points: this.form.get(['points']).value,
      active: this.form.get(['active']).value,
      stock: this.form.get(['stock']).value,
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
          this.gift[fieldName] = data;
          this.gift[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.gift[fieldName] = imageData;
      this.gift[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.gift, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
}
