import { Component, OnInit } from '@angular/core';
import { Mp3 } from './mp-3.model';
import { Mp3Service } from './mp-3.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-mp-3-detail',
  templateUrl: 'mp-3-detail.html',
})
export class Mp3DetailPage implements OnInit {
  mp3: Mp3 = {};

  constructor(
    private navController: NavController,
    private mp3Service: Mp3Service,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.mp3 = response.data;
    });
  }

  open(item: Mp3) {
    this.navController.navigateForward('/tabs/entities/mp-3/' + item.id + '/edit');
  }

  async deleteModal(item: Mp3) {
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
            this.mp3Service.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/mp-3');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
