import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Chips } from './chips.model';
import { ChipsService } from './chips.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-chips-detail',
  templateUrl: 'chips-detail.html',
})
export class ChipsDetailPage implements OnInit {
  chips: Chips = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private chipsService: ChipsService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.chips = response.data;
    });
  }

  open(item: Chips) {
    this.navController.navigateForward('/tabs/entities/chips/' + item.id + '/edit');
  }

  async deleteModal(item: Chips) {
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
            this.chipsService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/chips');
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
