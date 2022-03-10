import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FeeTransactionId } from './fee-transaction-id.model';
import { FeeTransactionIdService } from './fee-transaction-id.service';
import { FeeTransaction, FeeTransactionService } from '../fee-transaction';

@Component({
  selector: 'page-fee-transaction-id-update',
  templateUrl: 'fee-transaction-id-update.html',
})
export class FeeTransactionIdUpdatePage implements OnInit {
  feeTransactionId: FeeTransactionId;
  feeTransactions: FeeTransaction[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    transactionId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private feeTransactionService: FeeTransactionService,
    private feeTransactionIdService: FeeTransactionIdService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.feeTransactionService.query().subscribe(
      (data) => {
        this.feeTransactions = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.feeTransactionId = response.data;
      this.isNew = this.feeTransactionId.id === null || this.feeTransactionId.id === undefined;
      this.updateForm(this.feeTransactionId);
    });
  }

  updateForm(feeTransactionId: FeeTransactionId) {
    this.form.patchValue({
      id: feeTransactionId.id,
      transactionId: feeTransactionId.transactionId,
    });
  }

  save() {
    this.isSaving = true;
    const feeTransactionId = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.feeTransactionIdService.update(feeTransactionId));
    } else {
      this.subscribeToSaveResponse(this.feeTransactionIdService.create(feeTransactionId));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<FeeTransactionId>>) {
    result.subscribe(
      (res: HttpResponse<FeeTransactionId>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `FeeTransactionId ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/fee-transaction-id');
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

  private createFromForm(): FeeTransactionId {
    return {
      ...new FeeTransactionId(),
      id: this.form.get(['id']).value,
      transactionId: this.form.get(['transactionId']).value,
    };
  }

  compareFeeTransaction(first: FeeTransaction, second: FeeTransaction): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeeTransactionById(index: number, item: FeeTransaction) {
    return item.id;
  }
}
