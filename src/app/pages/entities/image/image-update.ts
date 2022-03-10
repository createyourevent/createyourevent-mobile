import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Image } from './image.model';
import { ImageService } from './image.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Product, ProductService } from '../product';
import { Shop, ShopService } from '../shop';
import { Event, EventService } from '../event';
import { CreateYourEventService, CreateYourEventServiceService } from '../create-your-event-service';
import { Organization, OrganizationService } from '../organization';

@Component({
  selector: 'page-image-update',
  templateUrl: 'image-update.html',
})
export class ImageUpdatePage implements OnInit {
  image: Image;
  users: User[];
  products: Product[];
  shops: Shop[];
  events: Event[];
  createYourEventServices: CreateYourEventService[];
  organizations: Organization[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, []],
    image: [null, []],
    imageContentType: [null, []],
    user: [null, []],
    product: [null, []],
    shop: [null, []],
    event: [null, []],
    service: [null, []],
    organization: [null, []],
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
    private productService: ProductService,
    private shopService: ShopService,
    private eventService: EventService,
    private createYourEventServiceService: CreateYourEventServiceService,
    private organizationService: OrganizationService,
    private imageService: ImageService
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
    this.productService.query().subscribe(
      (data) => {
        this.products = data.body;
      },
      (error) => this.onError(error)
    );
    this.shopService.query().subscribe(
      (data) => {
        this.shops = data.body;
      },
      (error) => this.onError(error)
    );
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.createYourEventServiceService.query().subscribe(
      (data) => {
        this.createYourEventServices = data.body;
      },
      (error) => this.onError(error)
    );
    this.organizationService.query().subscribe(
      (data) => {
        this.organizations = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.image = response.data;
      this.isNew = this.image.id === null || this.image.id === undefined;
      this.updateForm(this.image);
    });
  }

  updateForm(image: Image) {
    this.form.patchValue({
      id: image.id,
      name: image.name,
      image: image.image,
      imageContentType: image.imageContentType,
      user: image.user,
      product: image.product,
      shop: image.shop,
      event: image.event,
      service: image.service,
      organization: image.organization,
    });
  }

  save() {
    this.isSaving = true;
    const image = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.imageService.update(image));
    } else {
      this.subscribeToSaveResponse(this.imageService.create(image));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Image>>) {
    result.subscribe(
      (res: HttpResponse<Image>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Image ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/image');
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

  private createFromForm(): Image {
    return {
      ...new Image(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      image: this.form.get(['image']).value,
      imageContentType: this.form.get(['imageContentType']).value,
      user: this.form.get(['user']).value,
      product: this.form.get(['product']).value,
      shop: this.form.get(['shop']).value,
      event: this.form.get(['event']).value,
      service: this.form.get(['service']).value,
      organization: this.form.get(['organization']).value,
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
          this.image[fieldName] = data;
          this.image[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.image[fieldName] = imageData;
      this.image[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.image, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
  compareShop(first: Shop, second: Shop): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackShopById(index: number, item: Shop) {
    return item.id;
  }
  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
  compareCreateYourEventService(first: CreateYourEventService, second: CreateYourEventService): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCreateYourEventServiceById(index: number, item: CreateYourEventService) {
    return item.id;
  }
  compareOrganization(first: Organization, second: Organization): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrganizationById(index: number, item: Organization) {
    return item.id;
  }
}
