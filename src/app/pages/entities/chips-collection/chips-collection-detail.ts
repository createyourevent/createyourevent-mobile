import { Component, OnInit } from '@angular/core';
import { ChipsCollection } from './chips-collection.model';
import { ChipsCollectionService } from './chips-collection.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-chips-collection-detail',
  templateUrl: 'chips-collection-detail.html',
})
export class ChipsCollectionDetailPage implements OnInit {
  chipsCollection: ChipsCollection = {};

  constructor(
    private navController: NavController,
    private chipsCollectionService: ChipsCollectionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.chipsCollection = response.data;
    });
  }

  open(item: ChipsCollection) {
    this.navController.navigateForward('/tabs/entities/chips-collection/' + item.id + '/edit');
  }

  async deleteModal(item: ChipsCollection) {
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
            this.chipsCollectionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/chips-collection');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
