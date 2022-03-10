import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Coupon } from './coupon.model';
import { CouponService } from './coupon.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Event, EventService } from '../event';

@Component({
  selector: 'page-coupon-update',
  templateUrl: 'coupon-update.html',
})
export class CouponUpdatePage implements OnInit {
  coupon: Coupon;
  users: User[];
  events: Event[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, []],
    value: [null, []],
    description: [null, []],
    couponNr: [null, []],
    used: ['false', []],
    user: [null, []],
    event: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private userService: UserService,
    private eventService: EventService,
    private couponService: CouponService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.coupon = response.data;
      this.isNew = this.coupon.id === null || this.coupon.id === undefined;
      this.updateForm(this.coupon);
    });
  }

  updateForm(coupon: Coupon) {
    this.form.patchValue({
      id: coupon.id,
      title: coupon.title,
      value: coupon.value,
      description: coupon.description,
      couponNr: coupon.couponNr,
      used: coupon.used,
      user: coupon.user,
      event: coupon.event,
    });
  }

  save() {
    this.isSaving = true;
    const coupon = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.couponService.update(coupon));
    } else {
      this.subscribeToSaveResponse(this.couponService.create(coupon));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Coupon>>) {
    result.subscribe(
      (res: HttpResponse<Coupon>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Coupon ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/coupon');
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

  private createFromForm(): Coupon {
    return {
      ...new Coupon(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      value: this.form.get(['value']).value,
      description: this.form.get(['description']).value,
      couponNr: this.form.get(['couponNr']).value,
      used: this.form.get(['used']).value,
      user: this.form.get(['user']).value,
      event: this.form.get(['event']).value,
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

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
}
