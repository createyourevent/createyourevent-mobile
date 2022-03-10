import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Hotel } from './hotel.model';
import { HotelService } from './hotel.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-hotel-detail',
  templateUrl: 'hotel-detail.html',
})
export class HotelDetailPage implements OnInit {
  hotel: Hotel = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private hotelService: HotelService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.hotel = response.data;
    });
  }

  open(item: Hotel) {
    this.navController.navigateForward('/tabs/entities/hotel/' + item.id + '/edit');
  }

  async deleteModal(item: Hotel) {
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
            this.hotelService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/hotel');
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
