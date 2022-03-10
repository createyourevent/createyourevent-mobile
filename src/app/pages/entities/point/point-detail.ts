import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Point } from './point.model';
import { PointService } from './point.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-point-detail',
  templateUrl: 'point-detail.html',
})
export class PointDetailPage implements OnInit {
  point: Point = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private pointService: PointService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.point = response.data;
    });
  }

  open(item: Point) {
    this.navController.navigateForward('/tabs/entities/point/' + item.id + '/edit');
  }

  async deleteModal(item: Point) {
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
            this.pointService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/point');
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
