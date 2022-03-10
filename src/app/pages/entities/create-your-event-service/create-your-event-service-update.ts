import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateYourEventService } from './create-your-event-service.model';
import { CreateYourEventServiceService } from './create-your-event-service.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-create-your-event-service-update',
  templateUrl: 'create-your-event-service-update.html',
})
export class CreateYourEventServiceUpdatePage implements OnInit {
  createYourEventService: CreateYourEventService;
  users: User[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    logo: [null, []],
    logoContentType: [null, []],
    active: ['false', []],
    activeOwner: ['false', []],
    description: [null, [Validators.required]],
    address: [null, [Validators.required]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, []],
    category: [null, [Validators.required]],
    user: [null, []],
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
    private userService: UserService,
    private createYourEventServiceService: CreateYourEventServiceService
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
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.createYourEventService = response.data;
      this.isNew = this.createYourEventService.id === null || this.createYourEventService.id === undefined;
      this.updateForm(this.createYourEventService);
    });
  }

  updateForm(createYourEventService: CreateYourEventService) {
    this.form.patchValue({
      id: createYourEventService.id,
      name: createYourEventService.name,
      logo: createYourEventService.logo,
      logoContentType: createYourEventService.logoContentType,
      active: createYourEventService.active,
      activeOwner: createYourEventService.activeOwner,
      description: createYourEventService.description,
      address: createYourEventService.address,
      motto: createYourEventService.motto,
      phone: createYourEventService.phone,
      webAddress: createYourEventService.webAddress,
      category: createYourEventService.category,
      user: createYourEventService.user,
    });
  }

  save() {
    this.isSaving = true;
    const createYourEventService = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.createYourEventServiceService.update(createYourEventService));
    } else {
      this.subscribeToSaveResponse(this.createYourEventServiceService.create(createYourEventService));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<CreateYourEventService>>) {
    result.subscribe(
      (res: HttpResponse<CreateYourEventService>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `CreateYourEventService ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/create-your-event-service');
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

  private createFromForm(): CreateYourEventService {
    return {
      ...new CreateYourEventService(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      logo: this.form.get(['logo']).value,
      logoContentType: this.form.get(['logoContentType']).value,
      active: this.form.get(['active']).value,
      activeOwner: this.form.get(['activeOwner']).value,
      description: this.form.get(['description']).value,
      address: this.form.get(['address']).value,
      motto: this.form.get(['motto']).value,
      phone: this.form.get(['phone']).value,
      webAddress: this.form.get(['webAddress']).value,
      category: this.form.get(['category']).value,
      user: this.form.get(['user']).value,
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
          this.createYourEventService[fieldName] = data;
          this.createYourEventService[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.createYourEventService[fieldName] = imageData;
      this.createYourEventService[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.createYourEventService, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
