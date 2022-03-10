import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  contacts: Contact[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private contactService: ContactService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.contacts = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.contactService
      .query()
      .pipe(
        filter((res: HttpResponse<Contact[]>) => res.ok),
        map((res: HttpResponse<Contact[]>) => res.body)
      )
      .subscribe(
        (response: Contact[]) => {
          this.contacts = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: Contact) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/contact/new');
  }

  async edit(item: IonItemSliding, contact: Contact) {
    await this.navController.navigateForward('/tabs/entities/contact/' + contact.id + '/edit');
    await item.close();
  }

  async delete(contact) {
    this.contactService.delete(contact.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Contact deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(contact: Contact) {
    await this.navController.navigateForward('/tabs/entities/contact/' + contact.id + '/view');
  }
}
