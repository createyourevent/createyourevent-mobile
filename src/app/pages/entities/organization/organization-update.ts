import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Restaurant, RestaurantService } from '../restaurant';
import { Hotel, HotelService } from '../hotel';
import { Club, ClubService } from '../club';
import { Building, BuildingService } from '../building';

@Component({
  selector: 'page-organization-update',
  templateUrl: 'organization-update.html',
})
export class OrganizationUpdatePage implements OnInit {
  organization: Organization;
  users: User[];
  restaurants: Restaurant[];
  hotels: Hotel[];
  clubs: Club[];
  buildings: Building[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    organizationType: [null, [Validators.required]],
    logo: [null, []],
    logoContentType: [null, []],
    active: ['false', []],
    activeOwner: ['false', []],
    description: [null, [Validators.required]],
    address: [null, [Validators.required]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, []],
    placeNumber: [null, []],
    price: [null, []],
    rentType: [null, []],
    rentable: ['false', []],
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
    private restaurantService: RestaurantService,
    private hotelService: HotelService,
    private clubService: ClubService,
    private buildingService: BuildingService,
    private organizationService: OrganizationService
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
    this.restaurantService.query().subscribe(
      (data) => {
        this.restaurants = data.body;
      },
      (error) => this.onError(error)
    );
    this.hotelService.query().subscribe(
      (data) => {
        this.hotels = data.body;
      },
      (error) => this.onError(error)
    );
    this.clubService.query().subscribe(
      (data) => {
        this.clubs = data.body;
      },
      (error) => this.onError(error)
    );
    this.buildingService.query().subscribe(
      (data) => {
        this.buildings = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.organization = response.data;
      this.isNew = this.organization.id === null || this.organization.id === undefined;
      this.updateForm(this.organization);
    });
  }

  updateForm(organization: Organization) {
    this.form.patchValue({
      id: organization.id,
      name: organization.name,
      organizationType: organization.organizationType,
      logo: organization.logo,
      logoContentType: organization.logoContentType,
      active: organization.active,
      activeOwner: organization.activeOwner,
      description: organization.description,
      address: organization.address,
      motto: organization.motto,
      phone: organization.phone,
      webAddress: organization.webAddress,
      placeNumber: organization.placeNumber,
      price: organization.price,
      rentType: organization.rentType,
      rentable: organization.rentable,
      user: organization.user,
    });
  }

  save() {
    this.isSaving = true;
    const organization = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.organizationService.update(organization));
    } else {
      this.subscribeToSaveResponse(this.organizationService.create(organization));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Organization>>) {
    result.subscribe(
      (res: HttpResponse<Organization>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Organization ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/organization');
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

  private createFromForm(): Organization {
    return {
      ...new Organization(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      organizationType: this.form.get(['organizationType']).value,
      logo: this.form.get(['logo']).value,
      logoContentType: this.form.get(['logoContentType']).value,
      active: this.form.get(['active']).value,
      activeOwner: this.form.get(['activeOwner']).value,
      description: this.form.get(['description']).value,
      address: this.form.get(['address']).value,
      motto: this.form.get(['motto']).value,
      phone: this.form.get(['phone']).value,
      webAddress: this.form.get(['webAddress']).value,
      placeNumber: this.form.get(['placeNumber']).value,
      price: this.form.get(['price']).value,
      rentType: this.form.get(['rentType']).value,
      rentable: this.form.get(['rentable']).value,
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
          this.organization[fieldName] = data;
          this.organization[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.organization[fieldName] = imageData;
      this.organization[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.organization, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareRestaurant(first: Restaurant, second: Restaurant): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackRestaurantById(index: number, item: Restaurant) {
    return item.id;
  }
  compareHotel(first: Hotel, second: Hotel): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackHotelById(index: number, item: Hotel) {
    return item.id;
  }
  compareClub(first: Club, second: Club): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackClubById(index: number, item: Club) {
    return item.id;
  }
  compareBuilding(first: Building, second: Building): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackBuildingById(index: number, item: Building) {
    return item.id;
  }
}
