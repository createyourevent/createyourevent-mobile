import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Location } from './location.model';
import { LocationService } from './location.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html',
})
export class LocationDetailPage implements OnInit {
  location: Location = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.location = response.data;
    });
  }

  open(item: Location) {
    this.navController.navigateForward('/tabs/entities/location/' + item.id + '/edit');
  }

  async deleteModal(item: Location) {
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
            this.locationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/location');
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
