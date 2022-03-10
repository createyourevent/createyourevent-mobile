import { Component, OnInit } from '@angular/core';
import { OrganizationLikeDislike } from './organization-like-dislike.model';
import { OrganizationLikeDislikeService } from './organization-like-dislike.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-organization-like-dislike-detail',
  templateUrl: 'organization-like-dislike-detail.html',
})
export class OrganizationLikeDislikeDetailPage implements OnInit {
  organizationLikeDislike: OrganizationLikeDislike = {};

  constructor(
    private navController: NavController,
    private organizationLikeDislikeService: OrganizationLikeDislikeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.organizationLikeDislike = response.data;
    });
  }

  open(item: OrganizationLikeDislike) {
    this.navController.navigateForward('/tabs/entities/organization-like-dislike/' + item.id + '/edit');
  }

  async deleteModal(item: OrganizationLikeDislike) {
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
            this.organizationLikeDislikeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/organization-like-dislike');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
