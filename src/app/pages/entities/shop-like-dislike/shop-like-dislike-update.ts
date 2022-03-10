import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopLikeDislike } from './shop-like-dislike.model';
import { ShopLikeDislikeService } from './shop-like-dislike.service';
import { Shop, ShopService } from '../shop';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-shop-like-dislike-update',
  templateUrl: 'shop-like-dislike-update.html',
})
export class ShopLikeDislikeUpdatePage implements OnInit {
  shopLikeDislike: ShopLikeDislike;
  shops: Shop[];
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
    shop: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private shopService: ShopService,
    private userService: UserService,
    private shopLikeDislikeService: ShopLikeDislikeService
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
    this.activatedRoute.data.subscribe((response) => {
      this.shopLikeDislike = response.data;
      this.isNew = this.shopLikeDislike.id === null || this.shopLikeDislike.id === undefined;
      this.updateForm(this.shopLikeDislike);
    });
  }

  updateForm(shopLikeDislike: ShopLikeDislike) {
    this.form.patchValue({
      id: shopLikeDislike.id,
      like: shopLikeDislike.like,
      dislike: shopLikeDislike.dislike,
      date: this.isNew ? new Date().toISOString() : shopLikeDislike.date,
      comment: shopLikeDislike.comment,
      shop: shopLikeDislike.shop,
      user: shopLikeDislike.user,
    });
  }

  save() {
    this.isSaving = true;
    const shopLikeDislike = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.shopLikeDislikeService.update(shopLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.shopLikeDislikeService.create(shopLikeDislike));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ShopLikeDislike>>) {
    result.subscribe(
      (res: HttpResponse<ShopLikeDislike>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ShopLikeDislike ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/shop-like-dislike');
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

  private createFromForm(): ShopLikeDislike {
    return {
      ...new ShopLikeDislike(),
      id: this.form.get(['id']).value,
      like: this.form.get(['like']).value,
      dislike: this.form.get(['dislike']).value,
      date: new Date(this.form.get(['date']).value),
      comment: this.form.get(['comment']).value,
      shop: this.form.get(['shop']).value,
      user: this.form.get(['user']).value,
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
}
