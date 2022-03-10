import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { FeeTransactionId } from './fee-transaction-id.model';
import { FeeTransactionIdService } from './fee-transaction-id.service';

@Component({
  selector: 'page-fee-transaction-id',
  templateUrl: 'fee-transaction-id.html',
})
export class FeeTransactionIdPage {
  feeTransactionIds: FeeTransactionId[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private feeTransactionIdService: FeeTransactionIdService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.feeTransactionIds = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.feeTransactionIdService
      .query()
      .pipe(
        filter((res: HttpResponse<FeeTransactionId[]>) => res.ok),
        map((res: HttpResponse<FeeTransactionId[]>) => res.body)
      )
      .subscribe(
        (response: FeeTransactionId[]) => {
          this.feeTransactionIds = response;
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

  trackId(index: number, item: FeeTransactionId) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/fee-transaction-id/new');
  }

  async edit(item: IonItemSliding, feeTransactionId: FeeTransactionId) {
    await this.navController.navigateForward('/tabs/entities/fee-transaction-id/' + feeTransactionId.id + '/edit');
    await item.close();
  }

  async delete(feeTransactionId) {
    this.feeTransactionIdService.delete(feeTransactionId.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'FeeTransactionId deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(feeTransactionId: FeeTransactionId) {
    await this.navController.navigateForward('/tabs/entities/fee-transaction-id/' + feeTransactionId.id + '/view');
  }
}
