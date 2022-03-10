import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Tags } from './tags.model';
import { TagsService } from './tags.service';
import { Event, EventService } from '../event';
import { Product, ProductService } from '../product';
import { Shop, ShopService } from '../shop';
import { CreateYourEventService, CreateYourEventServiceService } from '../create-your-event-service';
import { Organization, OrganizationService } from '../organization';

@Component({
  selector: 'page-tags-update',
  templateUrl: 'tags-update.html',
})
export class TagsUpdatePage implements OnInit {
  tags: Tags;
  events: Event[];
  products: Product[];
  shops: Shop[];
  createYourEventServices: CreateYourEventService[];
  organizations: Organization[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    tag: [null, []],
    event: [null, []],
    product: [null, []],
    shop: [null, []],
    service: [null, []],
    organization: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private eventService: EventService,
    private productService: ProductService,
    private shopService: ShopService,
    private createYourEventServiceService: CreateYourEventServiceService,
    private organizationService: OrganizationService,
    private tagsService: TagsService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
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
      this.tags = response.data;
      this.isNew = this.tags.id === null || this.tags.id === undefined;
      this.updateForm(this.tags);
    });
  }

  updateForm(tags: Tags) {
    this.form.patchValue({
      id: tags.id,
      tag: tags.tag,
      event: tags.event,
      product: tags.product,
      shop: tags.shop,
      service: tags.service,
      organization: tags.organization,
    });
  }

  save() {
    this.isSaving = true;
    const tags = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.tagsService.update(tags));
    } else {
      this.subscribeToSaveResponse(this.tagsService.create(tags));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Tags>>) {
    result.subscribe(
      (res: HttpResponse<Tags>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Tags ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/tags');
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

  private createFromForm(): Tags {
    return {
      ...new Tags(),
      id: this.form.get(['id']).value,
      tag: this.form.get(['tag']).value,
      event: this.form.get(['event']).value,
      product: this.form.get(['product']).value,
      shop: this.form.get(['shop']).value,
      service: this.form.get(['service']).value,
      organization: this.form.get(['organization']).value,
    };
  }

  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
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
