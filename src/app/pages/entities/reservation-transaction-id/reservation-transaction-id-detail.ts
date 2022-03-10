import { Component, OnInit } from '@angular/core';
import { ReservationTransactionId } from './reservation-transaction-id.model';
import { ReservationTransactionIdService } from './reservation-transaction-id.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-reservation-transaction-id-detail',
  templateUrl: 'reservation-transaction-id-detail.html',
})
export class ReservationTransactionIdDetailPage implements OnInit {
  reservationTransactionId: ReservationTransactionId = {};

  constructor(
    private navController: NavController,
    private reservationTransactionIdService: ReservationTransactionIdService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.reservationTransactionId = response.data;
    });
  }

  open(item: ReservationTransactionId) {
    this.navController.navigateForward('/tabs/entities/reservation-transaction-id/' + item.id + '/edit');
  }

  async deleteModal(item: ReservationTransactionId) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.reservationTransactionIdService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/reservation-transaction-id');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
