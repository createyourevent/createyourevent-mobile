import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Event } from './event.model';
import { EventService } from './event.service';
import { Location, LocationService } from '../location';
import { EventDetails, EventDetailsService } from '../event-details';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { FeeTransaction, FeeTransactionService } from '../fee-transaction';

@Component({
  selector: 'page-event-update',
  templateUrl: 'event-update.html',
})
export class EventUpdatePage implements OnInit {
  event: Event;
  locations: Location[];
  eventDetails: EventDetails[];
  users: User[];
  feeTransactions: FeeTransaction[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  dateStart: string;
  dateEnd: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
    dateStart: [null, [Validators.required]],
    dateEnd: [null, [Validators.required]],
    category: [null, [Validators.required]],
    price: [null, [Validators.required]],
    flyer: [null, []],
    flyerContentType: [null, []],
    youtube: [null, []],
    privateOrPublic: [null, [Validators.required]],
    active: ['false', []],
    minPlacenumber: [null, [Validators.required]],
    placenumber: [null, [Validators.required]],
    investment: [null, [Validators.required]],
    status: [null, []],
    definitelyConfirmed: ['false', []],
    motto: [null, [Validators.required]],
    billed: ['false', []],
    stars: [null, []],
    billedOrganisator: ['false', []],
    billedeCreateYourEvent: ['false', []],
    location: [null, []],
    eventDetail: [null, []],
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
    private locationService: LocationService,
    private eventDetailsService: EventDetailsService,
    private userService: UserService,
    private feeTransactionService: FeeTransactionService,
    private eventService: EventService
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
    this.locationService.query({ filter: 'event-is-null' }).subscribe(
      (data) => {
        if (!this.event.location || !this.event.location.id) {
          this.locations = data.body;
        } else {
          this.locationService.find(this.event.location.id).subscribe(
            (subData: HttpResponse<Location>) => {
              this.locations = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.eventDetailsService.query({ filter: 'event-is-null' }).subscribe(
      (data) => {
        if (!this.event.eventDetail || !this.event.eventDetail.id) {
          this.eventDetails = data.body;
        } else {
          this.eventDetailsService.find(this.event.eventDetail.id).subscribe(
            (subData: HttpResponse<EventDetails>) => {
              this.eventDetails = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.feeTransactionService.query().subscribe(
      (data) => {
        this.feeTransactions = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.event = response.data;
      this.isNew = this.event.id === null || this.event.id === undefined;
      this.updateForm(this.event);
    });
  }

  updateForm(event: Event) {
    this.form.patchValue({
      id: event.id,
      name: event.name,
      description: event.description,
      dateStart: this.isNew ? new Date().toISOString() : event.dateStart,
      dateEnd: this.isNew ? new Date().toISOString() : event.dateEnd,
      category: event.category,
      price: event.price,
      flyer: event.flyer,
      flyerContentType: event.flyerContentType,
      youtube: event.youtube,
      privateOrPublic: event.privateOrPublic,
      active: event.active,
      minPlacenumber: event.minPlacenumber,
      placenumber: event.placenumber,
      investment: event.investment,
      status: event.status,
      definitelyConfirmed: event.definitelyConfirmed,
      motto: event.motto,
      billed: event.billed,
      stars: event.stars,
      billedOrganisator: event.billedOrganisator,
      billedeCreateYourEvent: event.billedeCreateYourEvent,
      location: event.location,
      eventDetail: event.eventDetail,
      user: event.user,
    });
  }

  save() {
    this.isSaving = true;
    const event = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Event>>) {
    result.subscribe(
      (res: HttpResponse<Event>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Event ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/event');
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

  private createFromForm(): Event {
    return {
      ...new Event(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      dateStart: new Date(this.form.get(['dateStart']).value),
      dateEnd: new Date(this.form.get(['dateEnd']).value),
      category: this.form.get(['category']).value,
      price: this.form.get(['price']).value,
      flyer: this.form.get(['flyer']).value,
      flyerContentType: this.form.get(['flyerContentType']).value,
      youtube: this.form.get(['youtube']).value,
      privateOrPublic: this.form.get(['privateOrPublic']).value,
      active: this.form.get(['active']).value,
      minPlacenumber: this.form.get(['minPlacenumber']).value,
      placenumber: this.form.get(['placenumber']).value,
      investment: this.form.get(['investment']).value,
      status: this.form.get(['status']).value,
      definitelyConfirmed: this.form.get(['definitelyConfirmed']).value,
      motto: this.form.get(['motto']).value,
      billed: this.form.get(['billed']).value,
      stars: this.form.get(['stars']).value,
      billedOrganisator: this.form.get(['billedOrganisator']).value,
      billedeCreateYourEvent: this.form.get(['billedeCreateYourEvent']).value,
      location: this.form.get(['location']).value,
      eventDetail: this.form.get(['eventDetail']).value,
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
          this.event[fieldName] = data;
          this.event[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.event[fieldName] = imageData;
      this.event[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.event, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  compareLocation(first: Location, second: Location): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackLocationById(index: number, item: Location) {
    return item.id;
  }
  compareEventDetails(first: EventDetails, second: EventDetails): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventDetailsById(index: number, item: EventDetails) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareFeeTransaction(first: FeeTransaction, second: FeeTransaction): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeeTransactionById(index: number, item: FeeTransaction) {
    return item.id;
  }
}
