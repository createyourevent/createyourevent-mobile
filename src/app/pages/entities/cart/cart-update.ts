import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from './cart.model';
import { CartService } from './cart.service';

@Component({
  selector: 'page-cart-update',
  templateUrl: 'cart-update.html',
})
export class CartUpdatePage implements OnInit {
  cart: Cart;
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    date: [null, []],
    totalCosts: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private cartService: CartService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.cart = response.data;
      this.isNew = this.cart.id === null || this.cart.id === undefined;
      this.updateForm(this.cart);
    });
  }

  updateForm(cart: Cart) {
    this.form.patchValue({
      id: cart.id,
      date: this.isNew ? new Date().toISOString() : cart.date,
      totalCosts: cart.totalCosts,
    });
  }

  save() {
    this.isSaving = true;
    const cart = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.cartService.update(cart));
    } else {
      this.subscribeToSaveResponse(this.cartService.create(cart));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Cart>>) {
    result.subscribe(
      (res: HttpResponse<Cart>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Cart ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/cart');
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

  private createFromForm(): Cart {
    return {
      ...new Cart(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      totalCosts: this.form.get(['totalCosts']).value,
    };
  }
}
