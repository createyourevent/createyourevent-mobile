import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { CreateYourEventService } from './create-your-event-service.model';
import { CreateYourEventServiceService } from './create-your-event-service.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-create-your-event-service-detail',
  templateUrl: 'create-your-event-service-detail.html',
})
export class CreateYourEventServiceDetailPage implements OnInit {
  createYourEventService: CreateYourEventService = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private createYourEventServiceService: CreateYourEventServiceService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.createYourEventService = response.data;
    });
  }

  open(item: CreateYourEventService) {
    this.navController.navigateForward('/tabs/entities/create-your-event-service/' + item.id + '/edit');
  }

  async deleteModal(item: CreateYourEventService) {
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
            this.createYourEventServiceService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/create-your-event-service');
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
