import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FeeTransactionEntry } from './fee-transaction-entry.model';
import { FeeTransactionEntryService } from './fee-transaction-entry.service';
import { FeeTransaction, FeeTransactionService } from '../fee-transaction';

@Component({
  selector: 'page-fee-transaction-entry-update',
  templateUrl: 'fee-transaction-entry-update.html',
})
export class FeeTransactionEntryUpdatePage implements OnInit {
  feeTransactionEntry: FeeTransactionEntry;
  feeTransactions: FeeTransaction[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    type: [null, []],
    value: [null, []],
    feeTransaction: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private feeTransactionService: FeeTransactionService,
    private feeTransactionEntryService: FeeTransactionEntryService
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
      this.feeTransactionEntry = response.data;
      this.isNew = this.feeTransactionEntry.id === null || this.feeTransactionEntry.id === undefined;
      this.updateForm(this.feeTransactionEntry);
    });
  }

  updateForm(feeTransactionEntry: FeeTransactionEntry) {
    this.form.patchValue({
      id: feeTransactionEntry.id,
      type: feeTransactionEntry.type,
      value: feeTransactionEntry.value,
      feeTransaction: feeTransactionEntry.feeTransaction,
    });
  }

  save() {
    this.isSaving = true;
    const feeTransactionEntry = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.feeTransactionEntryService.update(feeTransactionEntry));
    } else {
      this.subscribeToSaveResponse(this.feeTransactionEntryService.create(feeTransactionEntry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<FeeTransactionEntry>>) {
    result.subscribe(
      (res: HttpResponse<FeeTransactionEntry>) => this.onSaveSuccess(res),
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
      message: `FeeTransactionEntry ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/fee-transaction-entry');
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

  private createFromForm(): FeeTransactionEntry {
    return {
      ...new FeeTransactionEntry(),
      id: this.form.get(['id']).value,
      type: this.form.get(['type']).value,
      value: this.form.get(['value']).value,
      feeTransaction: this.form.get(['feeTransaction']).value,
    };
  }

  compareFeeTransaction(first: FeeTransaction, second: FeeTransaction): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeeTransactionById(index: number, item: FeeTransaction) {
    return item.id;
  }
}
