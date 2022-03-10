import { Component, OnInit } from '@angular/core';
import { EventProductRatingComment } from './event-product-rating-comment.model';
import { EventProductRatingCommentService } from './event-product-rating-comment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-product-rating-comment-detail',
  templateUrl: 'event-product-rating-comment-detail.html',
})
export class EventProductRatingCommentDetailPage implements OnInit {
  eventProductRatingComment: EventProductRatingComment = {};

  constructor(
    private navController: NavController,
    private eventProductRatingCommentService: EventProductRatingCommentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventProductRatingComment = response.data;
    });
  }

  open(item: EventProductRatingComment) {
    this.navController.navigateForward('/tabs/entities/event-product-rating-comment/' + item.id + '/edit');
  }

  async deleteModal(item: EventProductRatingComment) {
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
            this.eventProductRatingCommentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-product-rating-comment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
