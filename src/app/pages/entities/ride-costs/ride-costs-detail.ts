import { Component, OnInit } from '@angular/core';
import { RideCosts } from './ride-costs.model';
import { RideCostsService } from './ride-costs.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-ride-costs-detail',
  templateUrl: 'ride-costs-detail.html',
})
export class RideCostsDetailPage implements OnInit {
  rideCosts: RideCosts = {};

  constructor(
    private navController: NavController,
    private rideCostsService: RideCostsService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.rideCosts = response.data;
    });
  }

  open(item: RideCosts) {
    this.navController.navigateForward('/tabs/entities/ride-costs/' + item.id + '/edit');
  }

  async deleteModal(item: RideCosts) {
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
            this.rideCostsService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/ride-costs');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
