import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-shop-update',
  templateUrl: 'shop-update.html',
})
export class ShopUpdatePage implements OnInit {
  shop: Shop;
  users: User[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    productType: [null, [Validators.required]],
    logo: [null, []],
    logoContentType: [null, []],
    active: ['false', []],
    activeOwner: ['false', []],
    description: [null, [Validators.required]],
    address: [null, [Validators.required]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, []],
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
    private shopService: ShopService
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
      this.shop = response.data;
      this.isNew = this.shop.id === null || this.shop.id === undefined;
      this.updateForm(this.shop);
    });
  }

  updateForm(shop: Shop) {
    this.form.patchValue({
      id: shop.id,
      name: shop.name,
      productType: shop.productType,
      logo: shop.logo,
      logoContentType: shop.logoContentType,
      active: shop.active,
      activeOwner: shop.activeOwner,
      description: shop.description,
      address: shop.address,
      motto: shop.motto,
      phone: shop.phone,
      webAddress: shop.webAddress,
      user: shop.user,
    });
  }

  save() {
    this.isSaving = true;
    const shop = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.shopService.update(shop));
    } else {
      this.subscribeToSaveResponse(this.shopService.create(shop));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Shop>>) {
    result.subscribe(
      (res: HttpResponse<Shop>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Shop ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/shop');
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

  private createFromForm(): Shop {
    return {
      ...new Shop(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      productType: this.form.get(['productType']).value,
      logo: this.form.get(['logo']).value,
      logoContentType: this.form.get(['logoContentType']).value,
      active: this.form.get(['active']).value,
      activeOwner: this.form.get(['activeOwner']).value,
      description: this.form.get(['description']).value,
      address: this.form.get(['address']).value,
      motto: this.form.get(['motto']).value,
      phone: this.form.get(['phone']).value,
      webAddress: this.form.get(['webAddress']).value,
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
          this.shop[fieldName] = data;
          this.shop[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.shop[fieldName] = imageData;
      this.shop[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.shop, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
