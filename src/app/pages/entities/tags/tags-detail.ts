import { Component, OnInit } from '@angular/core';
import { Tags } from './tags.model';
import { TagsService } from './tags.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-tags-detail',
  templateUrl: 'tags-detail.html',
})
export class TagsDetailPage implements OnInit {
  tags: Tags = {};

  constructor(
    private navController: NavController,
    private tagsService: TagsService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.tags = response.data;
    });
  }

  open(item: Tags) {
    this.navController.navigateForward('/tabs/entities/tags/' + item.id + '/edit');
  }

  async deleteModal(item: Tags) {
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
            this.tagsService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/tags');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
