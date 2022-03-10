import { Component, OnInit } from '@angular/core';
import { EventLikeDislike } from './event-like-dislike.model';
import { EventLikeDislikeService } from './event-like-dislike.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-like-dislike-detail',
  templateUrl: 'event-like-dislike-detail.html',
})
export class EventLikeDislikeDetailPage implements OnInit {
  eventLikeDislike: EventLikeDislike = {};

  constructor(
    private navController: NavController,
    private eventLikeDislikeService: EventLikeDislikeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventLikeDislike = response.data;
    });
  }

  open(item: EventLikeDislike) {
    this.navController.navigateForward('/tabs/entities/event-like-dislike/' + item.id + '/edit');
  }

  async deleteModal(item: EventLikeDislike) {
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
            this.eventLikeDislikeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-like-dislike');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
