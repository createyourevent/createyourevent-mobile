import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Chips } from './chips.model';
import { ChipsService } from './chips.service';

@Component({
  selector: 'page-chips-update',
  templateUrl: 'chips-update.html',
})
export class ChipsUpdatePage implements OnInit {
  chips: Chips;
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    points: [null, []],
    website: [null, []],
    x: [null, []],
    y: [null, []],
    image: [null, []],
    imageContentType: [null, []],
    color: [null, []],
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
    private chipsService: ChipsService
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
      this.chips = response.data;
      this.isNew = this.chips.id === null || this.chips.id === undefined;
      this.updateForm(this.chips);
    });
  }

  updateForm(chips: Chips) {
    this.form.patchValue({
      id: chips.id,
      points: chips.points,
      website: chips.website,
      x: chips.x,
      y: chips.y,
      image: chips.image,
      imageContentType: chips.imageContentType,
      color: chips.color,
    });
  }

  save() {
    this.isSaving = true;
    const chips = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.chipsService.update(chips));
    } else {
      this.subscribeToSaveResponse(this.chipsService.create(chips));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Chips>>) {
    result.subscribe(
      (res: HttpResponse<Chips>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Chips ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/chips');
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

  private createFromForm(): Chips {
    return {
      ...new Chips(),
      id: this.form.get(['id']).value,
      points: this.form.get(['points']).value,
      website: this.form.get(['website']).value,
      x: this.form.get(['x']).value,
      y: this.form.get(['y']).value,
      image: this.form.get(['image']).value,
      imageContentType: this.form.get(['imageContentType']).value,
      color: this.form.get(['color']).value,
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
          this.chips[fieldName] = data;
          this.chips[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.chips[fieldName] = imageData;
      this.chips[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.chips, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
}
