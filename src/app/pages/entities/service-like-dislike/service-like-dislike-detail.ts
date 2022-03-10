import { Component, OnInit } from '@angular/core';
import { ServiceLikeDislike } from './service-like-dislike.model';
import { ServiceLikeDislikeService } from './service-like-dislike.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-like-dislike-detail',
  templateUrl: 'service-like-dislike-detail.html',
})
export class ServiceLikeDislikeDetailPage implements OnInit {
  serviceLikeDislike: ServiceLikeDislike = {};

  constructor(
    private navController: NavController,
    private serviceLikeDislikeService: ServiceLikeDislikeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceLikeDislike = response.data;
    });
  }

  open(item: ServiceLikeDislike) {
    this.navController.navigateForward('/tabs/entities/service-like-dislike/' + item.id + '/edit');
  }

  async deleteModal(item: ServiceLikeDislike) {
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
            this.serviceLikeDislikeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service-like-dislike');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
