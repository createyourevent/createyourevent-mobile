import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { FeeTransaction } from './fee-transaction.model';
import { FeeTransactionService } from './fee-transaction.service';

@Component({
  selector: 'page-fee-transaction',
  templateUrl: 'fee-transaction.html',
})
export class FeeTransactionPage {
  feeTransactions: FeeTransaction[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private feeTransactionService: FeeTransactionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.feeTransactions = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.feeTransactionService
      .query()
      .pipe(
        filter((res: HttpResponse<FeeTransaction[]>) => res.ok),
        map((res: HttpResponse<FeeTransaction[]>) => res.body)
      )
      .subscribe(
        (response: FeeTransaction[]) => {
          this.feeTransactions = response;
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

  trackId(index: number, item: FeeTransaction) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/fee-transaction/new');
  }

  async edit(item: IonItemSliding, feeTransaction: FeeTransaction) {
    await this.navController.navigateForward('/tabs/entities/fee-transaction/' + feeTransaction.id + '/edit');
    await item.close();
  }

  async delete(feeTransaction) {
    this.feeTransactionService.delete(feeTransaction.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'FeeTransaction deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(feeTransaction: FeeTransaction) {
    await this.navController.navigateForward('/tabs/entities/fee-transaction/' + feeTransaction.id + '/view');
  }
}
