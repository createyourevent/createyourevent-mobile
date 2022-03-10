import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Reservation } from '../../entities/reservation';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  @Input() reservation: Reservation;
  value = '';
  elementType = NgxQrcodeElementTypes.IMG;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  content: string;

  constructor(
    public navController: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private modalContrller: ModalController,
    private pdfGenerator: PDFGenerator
  ) {}

  ngOnInit() {
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

  closeModal() {
    this.modalContrller.dismiss();
  }
  downloadInvoice() {
    this.content = document.getElementById('ticket').innerHTML;
    const options = {
      documentSize: 'A4',
      type: 'share',
      // landscape: 'portrait',
      fileName: 'Ticket-' + this.reservation.event.name + '.pdf',
    };
    this.pdfGenerator
      .fromData(this.content, options)
      .then((base64) => {
        console.log('OK', base64);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
}
