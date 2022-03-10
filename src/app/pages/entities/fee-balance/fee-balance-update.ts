import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FeeBalance } from './fee-balance.model';
import { FeeBalanceService } from './fee-balance.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-fee-balance-update',
  templateUrl: 'fee-balance-update.html',
})
export class FeeBalanceUpdatePage implements OnInit {
  feeBalance: FeeBalance;
  users: User[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    date: [null, []],
    type: [null, []],
    total: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private feeBalanceService: FeeBalanceService
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
    this.activatedRoute.data.subscribe((response) => {
      this.feeBalance = response.data;
      this.isNew = this.feeBalance.id === null || this.feeBalance.id === undefined;
      this.updateForm(this.feeBalance);
    });
  }

  updateForm(feeBalance: FeeBalance) {
    this.form.patchValue({
      id: feeBalance.id,
      date: this.isNew ? new Date().toISOString() : feeBalance.date,
      type: feeBalance.type,
      total: feeBalance.total,
      user: feeBalance.user,
    });
  }

  save() {
    this.isSaving = true;
    const feeBalance = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.feeBalanceService.update(feeBalance));
    } else {
      this.subscribeToSaveResponse(this.feeBalanceService.create(feeBalance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<FeeBalance>>) {
    result.subscribe(
      (res: HttpResponse<FeeBalance>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `FeeBalance ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/fee-balance');
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

  private createFromForm(): FeeBalance {
    return {
      ...new FeeBalance(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      type: this.form.get(['type']).value,
      total: this.form.get(['total']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
