import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { ServiceOffer } from './service-offer.model';
import { ServiceOfferService } from './service-offer.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-offer-detail',
  templateUrl: 'service-offer-detail.html',
})
export class ServiceOfferDetailPage implements OnInit {
  serviceOffer: ServiceOffer = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private serviceOfferService: ServiceOfferService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceOffer = response.data;
    });
  }

  open(item: ServiceOffer) {
    this.navController.navigateForward('/tabs/entities/service-offer/' + item.id + '/edit');
  }

  async deleteModal(item: ServiceOffer) {
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
            this.serviceOfferService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service-offer');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
