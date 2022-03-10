import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductComment } from './product-comment.model';
import { ProductCommentService } from './product-comment.service';
import { Product, ProductService } from '../product';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-product-comment-update',
  templateUrl: 'product-comment-update.html',
})
export class ProductCommentUpdatePage implements OnInit {
  productComment: ProductComment;
  products: Product[];
  users: User[];
  productComments: ProductComment[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    comment: [null, []],
    date: [null, []],
    product: [null, []],
    user: [null, []],
    productComment: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private userService: UserService,
    private productCommentService: ProductCommentService
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
    this.productCommentService.query().subscribe(
      (data) => {
        this.productComments = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.productComment = response.data;
      this.isNew = this.productComment.id === null || this.productComment.id === undefined;
      this.updateForm(this.productComment);
    });
  }

  updateForm(productComment: ProductComment) {
    this.form.patchValue({
      id: productComment.id,
      comment: productComment.comment,
      date: this.isNew ? new Date().toISOString() : productComment.date,
      product: productComment.product,
      user: productComment.user,
      productComment: productComment.productComment,
    });
  }

  save() {
    this.isSaving = true;
    const productComment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productCommentService.update(productComment));
    } else {
      this.subscribeToSaveResponse(this.productCommentService.create(productComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductComment>>) {
    result.subscribe(
      (res: HttpResponse<ProductComment>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ProductComment ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-comment');
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

  private createFromForm(): ProductComment {
    return {
      ...new ProductComment(),
      id: this.form.get(['id']).value,
      comment: this.form.get(['comment']).value,
      date: new Date(this.form.get(['date']).value),
      product: this.form.get(['product']).value,
      user: this.form.get(['user']).value,
      productComment: this.form.get(['productComment']).value,
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
  compareProductComment(first: ProductComment, second: ProductComment): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductCommentById(index: number, item: ProductComment) {
    return item.id;
  }
}
