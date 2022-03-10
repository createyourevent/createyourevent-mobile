import { Component, OnInit } from '@angular/core';
import { ServiceComment } from './service-comment.model';
import { ServiceCommentService } from './service-comment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-comment-detail',
  templateUrl: 'service-comment-detail.html',
})
export class ServiceCommentDetailPage implements OnInit {
  serviceComment: ServiceComment = {};

  constructor(
    private navController: NavController,
    private serviceCommentService: ServiceCommentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceComment = response.data;
    });
  }

  open(item: ServiceComment) {
    this.navController.navigateForward('/tabs/entities/service-comment/' + item.id + '/edit');
  }

  async deleteModal(item: ServiceComment) {
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
            this.serviceCommentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service-comment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
