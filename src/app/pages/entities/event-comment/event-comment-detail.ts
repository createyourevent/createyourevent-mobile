import { Component, OnInit } from '@angular/core';
import { EventComment } from './event-comment.model';
import { EventCommentService } from './event-comment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-comment-detail',
  templateUrl: 'event-comment-detail.html',
})
export class EventCommentDetailPage implements OnInit {
  eventComment: EventComment = {};

  constructor(
    private navController: NavController,
    private eventCommentService: EventCommentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventComment = response.data;
    });
  }

  open(item: EventComment) {
    this.navController.navigateForward('/tabs/entities/event-comment/' + item.id + '/edit');
  }

  async deleteModal(item: EventComment) {
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
            this.eventCommentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-comment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
