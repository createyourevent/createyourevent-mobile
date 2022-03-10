import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-partner-detail',
  templateUrl: 'partner-detail.html',
})
export class PartnerDetailPage implements OnInit {
  partner: Partner = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private partnerService: PartnerService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.partner = response.data;
    });
  }

  open(item: Partner) {
    this.navController.navigateForward('/tabs/entities/partner/' + item.id + '/edit');
  }

  async deleteModal(item: Partner) {
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
            this.partnerService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/partner');
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
