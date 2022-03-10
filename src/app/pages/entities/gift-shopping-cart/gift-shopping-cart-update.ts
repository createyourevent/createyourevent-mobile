import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GiftShoppingCart } from './gift-shopping-cart.model';
import { GiftShoppingCartService } from './gift-shopping-cart.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Gift, GiftService } from '../gift';

@Component({
  selector: 'page-gift-shopping-cart-update',
  templateUrl: 'gift-shopping-cart-update.html',
})
export class GiftShoppingCartUpdatePage implements OnInit {
  giftShoppingCart: GiftShoppingCart;
  users: User[];
  gifts: Gift[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    date: [null, []],
    amount: [null, []],
    user: [null, []],
    gift: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private giftService: GiftService,
    private giftShoppingCartService: GiftShoppingCartService
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
    this.giftService.query().subscribe(
      (data) => {
        this.gifts = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.giftShoppingCart = response.data;
      this.isNew = this.giftShoppingCart.id === null || this.giftShoppingCart.id === undefined;
      this.updateForm(this.giftShoppingCart);
    });
  }

  updateForm(giftShoppingCart: GiftShoppingCart) {
    this.form.patchValue({
      id: giftShoppingCart.id,
      date: this.isNew ? new Date().toISOString() : giftShoppingCart.date,
      amount: giftShoppingCart.amount,
      user: giftShoppingCart.user,
      gift: giftShoppingCart.gift,
    });
  }

  save() {
    this.isSaving = true;
    const giftShoppingCart = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.giftShoppingCartService.update(giftShoppingCart));
    } else {
      this.subscribeToSaveResponse(this.giftShoppingCartService.create(giftShoppingCart));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<GiftShoppingCart>>) {
    result.subscribe(
      (res: HttpResponse<GiftShoppingCart>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `GiftShoppingCart ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/gift-shopping-cart');
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

  private createFromForm(): GiftShoppingCart {
    return {
      ...new GiftShoppingCart(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      amount: this.form.get(['amount']).value,
      user: this.form.get(['user']).value,
      gift: this.form.get(['gift']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareGift(first: Gift, second: Gift): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackGiftById(index: number, item: Gift) {
    return item.id;
  }
}
