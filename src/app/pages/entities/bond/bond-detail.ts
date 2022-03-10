import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Bond } from './bond.model';
import { BondService } from './bond.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-bond-detail',
  templateUrl: 'bond-detail.html',
})
export class BondDetailPage implements OnInit {
  bond: Bond = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private bondService: BondService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.bond = response.data;
    });
  }

  open(item: Bond) {
    this.navController.navigateForward('/tabs/entities/bond/' + item.id + '/edit');
  }

  async deleteModal(item: Bond) {
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
            this.bondService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/bond');
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
