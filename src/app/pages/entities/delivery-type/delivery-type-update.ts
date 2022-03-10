import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DeliveryType } from './delivery-type.model';
import { DeliveryTypeService } from './delivery-type.service';
import { Product, ProductService } from '../product';

@Component({
  selector: 'page-delivery-type-update',
  templateUrl: 'delivery-type-update.html',
})
export class DeliveryTypeUpdatePage implements OnInit {
  deliveryType: DeliveryType;
  products: Product[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    deliveryType: [null, []],
    minimumOrderQuantity: [null, []],
    price: [null, []],
    pricePerKilometre: [null, []],
    product: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private deliveryTypeService: DeliveryTypeService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.productService.query().subscribe(
      (data) => {
        this.products = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.deliveryType = response.data;
      this.isNew = this.deliveryType.id === null || this.deliveryType.id === undefined;
      this.updateForm(this.deliveryType);
    });
  }

  updateForm(deliveryType: DeliveryType) {
    this.form.patchValue({
      id: deliveryType.id,
      deliveryType: deliveryType.deliveryType,
      minimumOrderQuantity: deliveryType.minimumOrderQuantity,
      price: deliveryType.price,
      pricePerKilometre: deliveryType.pricePerKilometre,
      product: deliveryType.product,
    });
  }

  save() {
    this.isSaving = true;
    const deliveryType = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.deliveryTypeService.update(deliveryType));
    } else {
      this.subscribeToSaveResponse(this.deliveryTypeService.create(deliveryType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<DeliveryType>>) {
    result.subscribe(
      (res: HttpResponse<DeliveryType>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `DeliveryType ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/delivery-type');
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

  private createFromForm(): DeliveryType {
    return {
      ...new DeliveryType(),
      id: this.form.get(['id']).value,
      deliveryType: this.form.get(['deliveryType']).value,
      minimumOrderQuantity: this.form.get(['minimumOrderQuantity']).value,
      price: this.form.get(['price']).value,
      pricePerKilometre: this.form.get(['pricePerKilometre']).value,
      product: this.form.get(['product']).value,
    };
  }

  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
}
