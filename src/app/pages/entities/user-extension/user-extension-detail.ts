import { Component, OnInit } from '@angular/core';
import { UserExtension } from './user-extension.model';
import { UserExtensionService } from './user-extension.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-user-extension-detail',
  templateUrl: 'user-extension-detail.html',
})
export class UserExtensionDetailPage implements OnInit {
  userExtension: UserExtension = {};

  constructor(
    private navController: NavController,
    private userExtensionService: UserExtensionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.userExtension = response.data;
    });
  }

  open(item: UserExtension) {
    this.navController.navigateForward('/tabs/entities/user-extension/' + item.id + '/edit');
  }

  async deleteModal(item: UserExtension) {
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
            this.userExtensionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/user-extension');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
