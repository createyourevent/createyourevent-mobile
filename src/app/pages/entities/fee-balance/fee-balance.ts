import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { FeeBalance } from './fee-balance.model';
import { FeeBalanceService } from './fee-balance.service';

@Component({
  selector: 'page-fee-balance',
  templateUrl: 'fee-balance.html',
})
export class FeeBalancePage {
  feeBalances: FeeBalance[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private feeBalanceService: FeeBalanceService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.feeBalances = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.feeBalanceService
      .query()
      .pipe(
        filter((res: HttpResponse<FeeBalance[]>) => res.ok),
        map((res: HttpResponse<FeeBalance[]>) => res.body)
      )
      .subscribe(
        (response: FeeBalance[]) => {
          this.feeBalances = response;
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

  trackId(index: number, item: FeeBalance) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/fee-balance/new');
  }

  async edit(item: IonItemSliding, feeBalance: FeeBalance) {
    await this.navController.navigateForward('/tabs/entities/fee-balance/' + feeBalance.id + '/edit');
    await item.close();
  }

  async delete(feeBalance) {
    this.feeBalanceService.delete(feeBalance.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'FeeBalance deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(feeBalance: FeeBalance) {
    await this.navController.navigateForward('/tabs/entities/fee-balance/' + feeBalance.id + '/view');
  }
}
