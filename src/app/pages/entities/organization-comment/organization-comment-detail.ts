import { Component, OnInit } from '@angular/core';
import { OrganizationComment } from './organization-comment.model';
import { OrganizationCommentService } from './organization-comment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-organization-comment-detail',
  templateUrl: 'organization-comment-detail.html',
})
export class OrganizationCommentDetailPage implements OnInit {
  organizationComment: OrganizationComment = {};

  constructor(
    private navController: NavController,
    private organizationCommentService: OrganizationCommentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.organizationComment = response.data;
    });
  }

  open(item: OrganizationComment) {
    this.navController.navigateForward('/tabs/entities/organization-comment/' + item.id + '/edit');
  }

  async deleteModal(item: OrganizationComment) {
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
            this.organizationCommentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/organization-comment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
