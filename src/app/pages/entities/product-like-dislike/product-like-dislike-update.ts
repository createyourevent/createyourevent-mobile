import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductLikeDislike } from './product-like-dislike.model';
import { ProductLikeDislikeService } from './product-like-dislike.service';
import { Product, ProductService } from '../product';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-product-like-dislike-update',
  templateUrl: 'product-like-dislike-update.html',
})
export class ProductLikeDislikeUpdatePage implements OnInit {
  productLikeDislike: ProductLikeDislike;
  products: Product[];
  users: User[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    like: [null, []],
    dislike: [null, []],
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
    private productLikeDislikeService: ProductLikeDislikeService
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
      this.productLikeDislike = response.data;
      this.isNew = this.productLikeDislike.id === null || this.productLikeDislike.id === undefined;
      this.updateForm(this.productLikeDislike);
    });
  }

  updateForm(productLikeDislike: ProductLikeDislike) {
    this.form.patchValue({
      id: productLikeDislike.id,
      like: productLikeDislike.like,
      dislike: productLikeDislike.dislike,
      date: this.isNew ? new Date().toISOString() : productLikeDislike.date,
      comment: productLikeDislike.comment,
      product: productLikeDislike.product,
      user: productLikeDislike.user,
    });
  }

  save() {
    this.isSaving = true;
    const productLikeDislike = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productLikeDislikeService.update(productLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.productLikeDislikeService.create(productLikeDislike));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductLikeDislike>>) {
    result.subscribe(
      (res: HttpResponse<ProductLikeDislike>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `ProductLikeDislike ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-like-dislike');
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

  private createFromForm(): ProductLikeDislike {
    return {
      ...new ProductLikeDislike(),
      id: this.form.get(['id']).value,
      like: this.form.get(['like']).value,
      dislike: this.form.get(['dislike']).value,
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
