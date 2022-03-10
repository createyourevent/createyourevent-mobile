import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopComment } from './shop-comment.model';
import { ShopCommentService } from './shop-comment.service';
import { Shop, ShopService } from '../shop';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-shop-comment-update',
  templateUrl: 'shop-comment-update.html',
})
export class ShopCommentUpdatePage implements OnInit {
  shopComment: ShopComment;
  shops: Shop[];
  users: User[];
  shopComments: ShopComment[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    comment: [null, []],
    date: [null, []],
    shop: [null, []],
    user: [null, []],
    shopComment: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private shopService: ShopService,
    private userService: UserService,
    private shopCommentService: ShopCommentService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.shopService.query().subscribe(
      (data) => {
        this.shops = data.body;
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.shopCommentService.query().subscribe(
      (data) => {
        this.shopComments = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.shopComment = response.data;
      this.isNew = this.shopComment.id === null || this.shopComment.id === undefined;
      this.updateForm(this.shopComment);
    });
  }

  updateForm(shopComment: ShopComment) {
    this.form.patchValue({
      id: shopComment.id,
      comment: shopComment.comment,
      date: this.isNew ? new Date().toISOString() : shopComment.date,
      shop: shopComment.shop,
      user: shopComment.user,
      shopComment: shopComment.shopComment,
    });
  }

  save() {
    this.isSaving = true;
    const shopComment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.shopCommentService.update(shopComment));
    } else {
      this.subscribeToSaveResponse(this.shopCommentService.create(shopComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ShopComment>>) {
    result.subscribe(
      (res: HttpResponse<ShopComment>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ShopComment ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/shop-comment');
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

  private createFromForm(): ShopComment {
    return {
      ...new ShopComment(),
      id: this.form.get(['id']).value,
      comment: this.form.get(['comment']).value,
      date: new Date(this.form.get(['date']).value),
      shop: this.form.get(['shop']).value,
      user: this.form.get(['user']).value,
      shopComment: this.form.get(['shopComment']).value,
    };
  }

  compareShop(first: Shop, second: Shop): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackShopById(index: number, item: Shop) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareShopComment(first: ShopComment, second: ShopComment): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackShopCommentById(index: number, item: ShopComment) {
    return item.id;
  }
}
