import { Component, OnInit } from '@angular/core';
import { ChipsAdmin } from './chips-admin.model';
import { ChipsAdminService } from './chips-admin.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-chips-admin-detail',
  templateUrl: 'chips-admin-detail.html',
})
export class ChipsAdminDetailPage implements OnInit {
  chipsAdmin: ChipsAdmin = {};

  constructor(
    private navController: NavController,
    private chipsAdminService: ChipsAdminService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.chipsAdmin = response.data;
    });
  }

  open(item: ChipsAdmin) {
    this.navController.navigateForward('/tabs/entities/chips-admin/' + item.id + '/edit');
  }

  async deleteModal(item: ChipsAdmin) {
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
            this.chipsAdminService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/chips-admin');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
