import { Component, OnInit } from '@angular/core';
import { ServiceMap } from './service-map.model';
import { ServiceMapService } from './service-map.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-map-detail',
  templateUrl: 'service-map-detail.html',
})
export class ServiceMapDetailPage implements OnInit {
  serviceMap: ServiceMap = {};

  constructor(
    private navController: NavController,
    private serviceMapService: ServiceMapService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceMap = response.data;
    });
  }

  open(item: ServiceMap) {
    this.navController.navigateForward('/tabs/entities/service-map/' + item.id + '/edit');
  }

  async deleteModal(item: ServiceMap) {
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
            this.serviceMapService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service-map');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
