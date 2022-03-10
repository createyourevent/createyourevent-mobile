import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { FeeTransactionEntry } from './fee-transaction-entry.model';
import { FeeTransactionEntryService } from './fee-transaction-entry.service';

@Component({
  selector: 'page-fee-transaction-entry',
  templateUrl: 'fee-transaction-entry.html',
})
export class FeeTransactionEntryPage {
  feeTransactionEntries: FeeTransactionEntry[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private feeTransactionEntryService: FeeTransactionEntryService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.feeTransactionEntries = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.feeTransactionEntryService
      .query()
      .pipe(
        filter((res: HttpResponse<FeeTransactionEntry[]>) => res.ok),
        map((res: HttpResponse<FeeTransactionEntry[]>) => res.body)
      )
      .subscribe(
        (response: FeeTransactionEntry[]) => {
          this.feeTransactionEntries = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: FeeTransactionEntry) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/fee-transaction-entry/new');
  }

  async edit(item: IonItemSliding, feeTransactionEntry: FeeTransactionEntry) {
    await this.navController.navigateForward('/tabs/entities/fee-transaction-entry/' + feeTransactionEntry.id + '/edit');
    await item.close();
  }

  async delete(feeTransactionEntry) {
    this.feeTransactionEntryService.delete(feeTransactionEntry.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'FeeTransactionEntry deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(feeTransactionEntry: FeeTransactionEntry) {
    await this.navController.navigateForward('/tabs/entities/fee-transaction-entry/' + feeTransactionEntry.id + '/view');
  }
}
