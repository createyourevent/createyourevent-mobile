import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Reservation } from '../entities/reservation';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { TicketComponent } from './ticket/ticket.component';

@Component({
  selector: 'app-ticket-barcode',
  templateUrl: 'barcode.page.html',
  styleUrls: ['barcode.page.scss'],
})
export class TicketBarcodePage implements OnInit {
  public reservation: Reservation;
  value = '';
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  content: string;

  constructor(
    public navController: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.reservation = this.router.getCurrentNavigation().extras.state.reservation;
        this.value =
          this.reservation.user.id +
          ',,,' +
          this.reservation.event.id +
          ',,,' +
          this.reservation.id +
          ',,,' +
          this.reservation.user.email +
          ',,,' +
          this.reservation.event.name;
      }
    });
  }

  async openTicket(reservation) {
    const ticketModal = await this.createModal(TicketComponent, { reservation });
    await ticketModal.present();
  }

  async createModal(component, componentProps?, cssClass?): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component,
      cssClass,
      componentProps,
      backdropDismiss: true,
    });
    return modal;
  }

  private goBackToHomePage(): void {
    this.navController.navigateRoot('');
  }
}
