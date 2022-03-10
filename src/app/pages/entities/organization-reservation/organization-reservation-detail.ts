import { Component, OnInit } from '@angular/core';
import { OrganizationReservation } from './organization-reservation.model';
import { OrganizationReservationService } from './organization-reservation.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-organization-reservation-detail',
  templateUrl: 'organization-reservation-detail.html',
})
export class OrganizationReservationDetailPage implements OnInit {
  organizationReservation: OrganizationReservation = {};

  constructor(
    private navController: NavController,
    private organizationReservationService: OrganizationReservationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.organizationReservation = response.data;
    });
  }

  open(item: OrganizationReservation) {
    this.navController.navigateForward('/tabs/entities/organization-reservation/' + item.id + '/edit');
  }

  async deleteModal(item: OrganizationReservation) {
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
            this.organizationReservationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/organization-reservation');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
