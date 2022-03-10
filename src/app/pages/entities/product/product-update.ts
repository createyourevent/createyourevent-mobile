import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { Shop, ShopService } from '../shop';

@Component({
  selector: 'page-product-update',
  templateUrl: 'product-update.html',
})
export class ProductUpdatePage implements OnInit {
  product: Product;
  shops: Shop[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  dateAdded: string;
  dateModified: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, [Validators.required]],
    keywords: [null, []],
    description: [null, [Validators.required]],
    dateAdded: [null, []],
    dateModified: [null, []],
    priceType: [null, []],
    rentType: [null, []],
    price: [null, [Validators.required]],
    photo: [null, [Validators.required]],
    photoContentType: [null, []],
    photo2: [null, []],
    photo2ContentType: [null, []],
    photo3: [null, []],
    photo3ContentType: [null, []],
    youtube: [null, []],
    active: ['false', []],
    stock: [null, [Validators.required]],
    productType: [null, []],
    itemNumber: [null, []],
    status: [null, []],
    unit: [null, [Validators.required]],
    amount: [null, []],
    motto: [null, [Validators.required]],
    shop: [null, []],
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
    private shopService: ShopService,
    private productService: ProductService
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
    this.shopService.query().subscribe(
      (data) => {
        this.shops = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.product = response.data;
      this.isNew = this.product.id === null || this.product.id === undefined;
      this.updateForm(this.product);
    });
  }

  updateForm(product: Product) {
    this.form.patchValue({
      id: product.id,
      title: product.title,
      keywords: product.keywords,
      description: product.description,
      dateAdded: this.isNew ? new Date().toISOString() : product.dateAdded,
      dateModified: this.isNew ? new Date().toISOString() : product.dateModified,
      priceType: product.priceType,
      rentType: product.rentType,
      price: product.price,
      photo: product.photo,
      photoContentType: product.photoContentType,
      photo2: product.photo2,
      photo2ContentType: product.photo2ContentType,
      photo3: product.photo3,
      photo3ContentType: product.photo3ContentType,
      youtube: product.youtube,
      active: product.active,
      stock: product.stock,
      productType: product.productType,
      itemNumber: product.itemNumber,
      status: product.status,
      unit: product.unit,
      amount: product.amount,
      motto: product.motto,
      shop: product.shop,
    });
  }

  save() {
    this.isSaving = true;
    const product = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Product>>) {
    result.subscribe(
      (res: HttpResponse<Product>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Product ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product');
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

  private createFromForm(): Product {
    return {
      ...new Product(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      keywords: this.form.get(['keywords']).value,
      description: this.form.get(['description']).value,
      dateAdded: new Date(this.form.get(['dateAdded']).value),
      dateModified: new Date(this.form.get(['dateModified']).value),
      priceType: this.form.get(['priceType']).value,
      rentType: this.form.get(['rentType']).value,
      price: this.form.get(['price']).value,
      photo: this.form.get(['photo']).value,
      photoContentType: this.form.get(['photoContentType']).value,
      photo2: this.form.get(['photo2']).value,
      photo2ContentType: this.form.get(['photo2ContentType']).value,
      photo3: this.form.get(['photo3']).value,
      photo3ContentType: this.form.get(['photo3ContentType']).value,
      youtube: this.form.get(['youtube']).value,
      active: this.form.get(['active']).value,
      stock: this.form.get(['stock']).value,
      productType: this.form.get(['productType']).value,
      itemNumber: this.form.get(['itemNumber']).value,
      status: this.form.get(['status']).value,
      unit: this.form.get(['unit']).value,
      amount: this.form.get(['amount']).value,
      motto: this.form.get(['motto']).value,
      shop: this.form.get(['shop']).value,
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
          this.product[fieldName] = data;
          this.product[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.product[fieldName] = imageData;
      this.product[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.product, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  compareShop(first: Shop, second: Shop): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackShopById(index: number, item: Shop) {
    return item.id;
  }
}
