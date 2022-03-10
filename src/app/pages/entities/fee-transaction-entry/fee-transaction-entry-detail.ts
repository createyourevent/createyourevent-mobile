import { Component, OnInit } from '@angular/core';
import { FeeTransactionEntry } from './fee-transaction-entry.model';
import { FeeTransactionEntryService } from './fee-transaction-entry.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-fee-transaction-entry-detail',
  templateUrl: 'fee-transaction-entry-detail.html',
})
export class FeeTransactionEntryDetailPage implements OnInit {
  feeTransactionEntry: FeeTransactionEntry = {};

  constructor(
    private navController: NavController,
    private feeTransactionEntryService: FeeTransactionEntryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.feeTransactionEntry = response.data;
    });
  }

  open(item: FeeTransactionEntry) {
    this.navController.navigateForward('/tabs/entities/fee-transaction-entry/' + item.id + '/edit');
  }

  async deleteModal(item: FeeTransactionEntry) {
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
            this.feeTransactionEntryService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/fee-transaction-entry');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
