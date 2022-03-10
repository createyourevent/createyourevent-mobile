import { Component, OnInit } from '@angular/core';
import { Reservation } from './reservation.model';
import { ReservationService } from './reservation.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-reservation-detail',
  templateUrl: 'reservation-detail.html',
})
export class ReservationDetailPage implements OnInit {
  reservation: Reservation = {};

  constructor(
    private navController: NavController,
    private reservationService: ReservationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.reservation = response.data;
    });
  }

  open(item: Reservation) {
    this.navController.navigateForward('/tabs/entities/reservation/' + item.id + '/edit');
  }

  async deleteModal(item: Reservation) {
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
            this.reservationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/reservation');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
