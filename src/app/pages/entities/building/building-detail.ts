import { Component, OnInit } from '@angular/core';
import { Building } from './building.model';
import { BuildingService } from './building.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-building-detail',
  templateUrl: 'building-detail.html',
})
export class BuildingDetailPage implements OnInit {
  building: Building = {};

  constructor(
    private navController: NavController,
    private buildingService: BuildingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.building = response.data;
    });
  }

  open(item: Building) {
    this.navController.navigateForward('/tabs/entities/building/' + item.id + '/edit');
  }

  async deleteModal(item: Building) {
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
            this.buildingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/building');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
