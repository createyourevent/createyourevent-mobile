import { Component, OnInit } from '@angular/core';
import { ChipsCollectionChips } from './chips-collection-chips.model';
import { ChipsCollectionChipsService } from './chips-collection-chips.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-chips-collection-chips-detail',
  templateUrl: 'chips-collection-chips-detail.html',
})
export class ChipsCollectionChipsDetailPage implements OnInit {
  chipsCollectionChips: ChipsCollectionChips = {};

  constructor(
    private navController: NavController,
    private chipsCollectionChipsService: ChipsCollectionChipsService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.chipsCollectionChips = response.data;
    });
  }

  open(item: ChipsCollectionChips) {
    this.navController.navigateForward('/tabs/entities/chips-collection-chips/' + item.id + '/edit');
  }

  async deleteModal(item: ChipsCollectionChips) {
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
            this.chipsCollectionChipsService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/chips-collection-chips');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
