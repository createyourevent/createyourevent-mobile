import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html',
})
export class ContactDetailPage implements OnInit {
  contact: Contact = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private contactService: ContactService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.contact = response.data;
    });
  }

  open(item: Contact) {
    this.navController.navigateForward('/tabs/entities/contact/' + item.id + '/edit');
  }

  async deleteModal(item: Contact) {
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
            this.contactService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/contact');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
