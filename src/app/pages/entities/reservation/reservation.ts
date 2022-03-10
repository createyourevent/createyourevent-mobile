import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Reservation } from './reservation.model';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
})
export class ReservationPage {
  reservations: Reservation[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private reservationService: ReservationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.reservations = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.reservationService
      .query()
      .pipe(
        filter((res: HttpResponse<Reservation[]>) => res.ok),
        map((res: HttpResponse<Reservation[]>) => res.body)
      )
      .subscribe(
        (response: Reservation[]) => {
          this.reservations = response;
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

  trackId(index: number, item: Reservation) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/reservation/new');
  }

  async edit(item: IonItemSliding, reservation: Reservation) {
    await this.navController.navigateForward('/tabs/entities/reservation/' + reservation.id + '/edit');
    await item.close();
  }

  async delete(reservation) {
    this.reservationService.delete(reservation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Reservation deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(reservation: Reservation) {
    await this.navController.navigateForward('/tabs/entities/reservation/' + reservation.id + '/view');
  }
}
