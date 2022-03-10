import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopStarRating } from './shop-star-rating.model';
import { ShopStarRatingService } from './shop-star-rating.service';
import { Shop, ShopService } from '../shop';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-shop-star-rating-update',
  templateUrl: 'shop-star-rating-update.html',
})
export class ShopStarRatingUpdatePage implements OnInit {
  shopStarRating: ShopStarRating;
  shops: Shop[];
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
    private shopStarRatingService: ShopStarRatingService
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
      this.shopStarRating = response.data;
      this.isNew = this.shopStarRating.id === null || this.shopStarRating.id === undefined;
      this.updateForm(this.shopStarRating);
    });
  }

  updateForm(shopStarRating: ShopStarRating) {
    this.form.patchValue({
      id: shopStarRating.id,
      stars: shopStarRating.stars,
      date: this.isNew ? new Date().toISOString() : shopStarRating.date,
      comment: shopStarRating.comment,
      shop: shopStarRating.shop,
      user: shopStarRating.user,
    });
  }

  save() {
    this.isSaving = true;
    const shopStarRating = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.shopStarRatingService.update(shopStarRating));
    } else {
      this.subscribeToSaveResponse(this.shopStarRatingService.create(shopStarRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ShopStarRating>>) {
    result.subscribe(
      (res: HttpResponse<ShopStarRating>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ShopStarRating ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/shop-star-rating');
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

  private createFromForm(): ShopStarRating {
    return {
      ...new ShopStarRating(),
      id: this.form.get(['id']).value,
      stars: this.form.get(['stars']).value,
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
