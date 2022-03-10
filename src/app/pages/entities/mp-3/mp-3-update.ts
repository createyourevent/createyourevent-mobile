import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Mp3 } from './mp-3.model';
import { Mp3Service } from './mp-3.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Product, ProductService } from '../product';
import { Shop, ShopService } from '../shop';
import { Event, EventService } from '../event';
import { CreateYourEventService, CreateYourEventServiceService } from '../create-your-event-service';

@Component({
  selector: 'page-mp-3-update',
  templateUrl: 'mp-3-update.html',
})
export class Mp3UpdatePage implements OnInit {
  mp3: Mp3;
  users: User[];
  products: Product[];
  shops: Shop[];
  events: Event[];
  createYourEventServices: CreateYourEventService[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, []],
    artists: [null, []],
    duration: [null, []],
    url: [null, []],
    user: [null, []],
    product: [null, []],
    shop: [null, []],
    event: [null, []],
    service: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private productService: ProductService,
    private shopService: ShopService,
    private eventService: EventService,
    private createYourEventServiceService: CreateYourEventServiceService,
    private mp3Service: Mp3Service
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
    this.activatedRoute.data.subscribe((response) => {
      this.mp3 = response.data;
      this.isNew = this.mp3.id === null || this.mp3.id === undefined;
      this.updateForm(this.mp3);
    });
  }

  updateForm(mp3: Mp3) {
    this.form.patchValue({
      id: mp3.id,
      title: mp3.title,
      artists: mp3.artists,
      duration: mp3.duration,
      url: mp3.url,
      user: mp3.user,
      product: mp3.product,
      shop: mp3.shop,
      event: mp3.event,
      service: mp3.service,
    });
  }

  save() {
    this.isSaving = true;
    const mp3 = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.mp3Service.update(mp3));
    } else {
      this.subscribeToSaveResponse(this.mp3Service.create(mp3));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Mp3>>) {
    result.subscribe(
      (res: HttpResponse<Mp3>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Mp3 ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/mp-3');
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

  private createFromForm(): Mp3 {
    return {
      ...new Mp3(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      artists: this.form.get(['artists']).value,
      duration: this.form.get(['duration']).value,
      url: this.form.get(['url']).value,
      user: this.form.get(['user']).value,
      product: this.form.get(['product']).value,
      shop: this.form.get(['shop']).value,
      event: this.form.get(['event']).value,
      service: this.form.get(['service']).value,
    };
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
}
