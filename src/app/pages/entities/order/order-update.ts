import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'page-order-update',
  templateUrl: 'order-update.html',
})
export class OrderUpdatePage implements OnInit {
  order: Order;
  dateAdded: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    status: [null, []],
    dateAdded: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private orderService: OrderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.order = response.data;
      this.isNew = this.order.id === null || this.order.id === undefined;
      this.updateForm(this.order);
    });
  }

  updateForm(order: Order) {
    this.form.patchValue({
      id: order.id,
      status: order.status,
      dateAdded: this.isNew ? new Date().toISOString() : order.dateAdded,
    });
  }

  save() {
    this.isSaving = true;
    const order = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Order>>) {
    result.subscribe(
      (res: HttpResponse<Order>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Order ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/order');
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

  private createFromForm(): Order {
    return {
      ...new Order(),
      id: this.form.get(['id']).value,
      status: this.form.get(['status']).value,
      dateAdded: new Date(this.form.get(['dateAdded']).value),
    };
  }
}
