import { Component, OnInit } from '@angular/core';
import { UserPointAssociation } from './user-point-association.model';
import { UserPointAssociationService } from './user-point-association.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-user-point-association-detail',
  templateUrl: 'user-point-association-detail.html',
})
export class UserPointAssociationDetailPage implements OnInit {
  userPointAssociation: UserPointAssociation = {};

  constructor(
    private navController: NavController,
    private userPointAssociationService: UserPointAssociationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.userPointAssociation = response.data;
    });
  }

  open(item: UserPointAssociation) {
    this.navController.navigateForward('/tabs/entities/user-point-association/' + item.id + '/edit');
  }

  async deleteModal(item: UserPointAssociation) {
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
            this.userPointAssociationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/user-point-association');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
