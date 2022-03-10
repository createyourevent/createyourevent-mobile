import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Image } from './image.model';
import { ImageService } from './image.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-image-detail',
  templateUrl: 'image-detail.html',
})
export class ImageDetailPage implements OnInit {
  image: Image = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.image = response.data;
    });
  }

  open(item: Image) {
    this.navController.navigateForward('/tabs/entities/image/' + item.id + '/edit');
  }

  async deleteModal(item: Image) {
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
            this.imageService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/image');
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
