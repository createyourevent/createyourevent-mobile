import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductStarRating } from './product-star-rating.model';
import { ProductStarRatingService } from './product-star-rating.service';
import { Product, ProductService } from '../product';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-product-star-rating-update',
  templateUrl: 'product-star-rating-update.html',
})
export class ProductStarRatingUpdatePage implements OnInit {
  productStarRating: ProductStarRating;
  products: Product[];
  users: User[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    stars: [null, []],
    date: [null, []],
    comment: [null, []],
    product: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private userService: UserService,
    private productStarRatingService: ProductStarRatingService
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
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.productStarRating = response.data;
      this.isNew = this.productStarRating.id === null || this.productStarRating.id === undefined;
      this.updateForm(this.productStarRating);
    });
  }

  updateForm(productStarRating: ProductStarRating) {
    this.form.patchValue({
      id: productStarRating.id,
      stars: productStarRating.stars,
      date: this.isNew ? new Date().toISOString() : productStarRating.date,
      comment: productStarRating.comment,
      product: productStarRating.product,
      user: productStarRating.user,
    });
  }

  save() {
    this.isSaving = true;
    const productStarRating = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productStarRatingService.update(productStarRating));
    } else {
      this.subscribeToSaveResponse(this.productStarRatingService.create(productStarRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductStarRating>>) {
    result.subscribe(
      (res: HttpResponse<ProductStarRating>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ProductStarRating ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-star-rating');
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

  private createFromForm(): ProductStarRating {
    return {
      ...new ProductStarRating(),
      id: this.form.get(['id']).value,
      stars: this.form.get(['stars']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
      product: this.form.get(['product']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
