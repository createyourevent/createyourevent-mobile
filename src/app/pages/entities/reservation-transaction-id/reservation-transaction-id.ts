import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ReservationTransactionId } from './reservation-transaction-id.model';
import { ReservationTransactionIdService } from './reservation-transaction-id.service';

@Component({
  selector: 'page-reservation-transaction-id',
  templateUrl: 'reservation-transaction-id.html',
})
export class ReservationTransactionIdPage {
  reservationTransactionIds: ReservationTransactionId[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private reservationTransactionIdService: ReservationTransactionIdService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.reservationTransactionIds = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.reservationTransactionIdService
      .query()
      .pipe(
        filter((res: HttpResponse<ReservationTransactionId[]>) => res.ok),
        map((res: HttpResponse<ReservationTransactionId[]>) => res.body)
      )
      .subscribe(
        (response: ReservationTransactionId[]) => {
          this.reservationTransactionIds = response;
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

  trackId(index: number, item: ReservationTransactionId) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/reservation-transaction-id/new');
  }

  async edit(item: IonItemSliding, reservationTransactionId: ReservationTransactionId) {
    await this.navController.navigateForward('/tabs/entities/reservation-transaction-id/' + reservationTransactionId.id + '/edit');
    await item.close();
  }

  async delete(reservationTransactionId) {
    this.reservationTransactionIdService.delete(reservationTransactionId.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ReservationTransactionId deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(reservationTransactionId: ReservationTransactionId) {
    await this.navController.navigateForward('/tabs/entities/reservation-transaction-id/' + reservationTransactionId.id + '/view');
  }
}
