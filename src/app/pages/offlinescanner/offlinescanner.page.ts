import { IUser } from './../../shared/model/user.model';
import { GeneralService } from './../../general.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ZBar } from '@ionic-native/zbar/ngx';
import { ToastController } from '@ionic/angular';
import { Event } from '../entities/event';
import * as dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Account } from 'src/model/account.model';
import { ConnectivityProvider } from 'src/app/services/network/connectivityProvider.service';
import { DatabaseService, ReservationSQLite, TicketSQLite } from 'src/app/database.service';

@Component({
  selector: 'app-offline-scanner',
  templateUrl: 'offlinescanner.page.html',
  styleUrls: ['offlinescanner.page.scss'],
})
export class OfflineScannerPage {
  optionZbar: any;
  scannedOutput: any;
  reservationId: number;
  userId: string;
  eventId: number;
  email: string;
  eventName: string;
  dbEvent: string;
  reservation: ReservationSQLite;
  events: Event[];
  event: Event = null;
  user: IUser;
  checkEventId: number;
  account: Account;
  onOffLine: boolean;
  showInfo = false;
  t: TicketSQLite;

  constructor(
    public navController: NavController,
    private zbarPlugin: ZBar,
    public toastController: ToastController,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private connectivityProvider: ConnectivityProvider,
    private databaseService: DatabaseService
  ) {
    this.optionZbar = {
      flash: 'off',
      drawSight: false,
    };
  }

  ionViewWillEnter() {
    this.connectivityProvider.appIsOnline$.subscribe((online) => {
      console.log(online);
      if (online) {
        this.onOffLine = true;
      } else {
        this.onOffLine = false;
      }
    });
    this.databaseService.getEventName().then((res) => {
      this.dbEvent = res;
    });
    this.databaseService.getEventId().then((res) => {
      this.checkEventId = res;
    });
  }

  checkTicketValidity() {
    this.showInfo = false;
    this.zbarPlugin
      .scan(this.optionZbar)
      .then((respone) => {
        let infoArr: string[] = [];
        this.scannedOutput = respone;
        infoArr = this.scannedOutput.split(',,,');
        this.reservationId = Number(infoArr[2]);
        this.userId = infoArr[0];
        this.eventId = Number(infoArr[1]);
        this.email = infoArr[3];
        this.eventName = infoArr[4];
        this.databaseService.getReservation(this.reservationId).then((res) => {
          this.reservation = res;
          if (!this.reservation) {
            this.presentWrongEvent();
          } else {
            this.databaseService.getTicket(this.reservation.ticketId).then((ticket) => {
              this.t = ticket;
              if (this.t.ticketsUsed === null) {
                this.t.ticketsUsed = 0;
              }
              this.t.ticketsUsed += 1;
              if (this.reservation.eventId !== this.checkEventId) {
                this.presentWrongEvent();
              } else if (this.reservation.accessEvent === 1 && this.t.ticketsUsed > this.t.amount) {
                this.presentInvalidTicket(dayjs(this.reservation.accessDate));
              } else {
                this.presentValidTicket();
              }
            });
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
  }

  barcodeScanner() {
    this.showInfo = false;
    this.databaseService.getEventId().then((re) => {
      this.checkEventId = re;
      this.zbarPlugin
        .scan(this.optionZbar)
        .then((respone) => {
          let infoArr: string[] = [];
          this.scannedOutput = respone;
          infoArr = this.scannedOutput.split(',,,');
          this.reservationId = Number(infoArr[2]);
          this.userId = infoArr[0];
          this.eventId = Number(infoArr[1]);
          this.email = infoArr[3];
          this.eventName = infoArr[4];
          this.databaseService.getReservation(this.reservationId).then((res) => {
            this.reservation = res;
            if (!this.reservation) {
              this.presentWrongEvent();
            } else {
              this.databaseService.getTicket(this.reservation.ticketId).then((ticket) => {
                this.t = ticket;
                if (this.t.ticketsUsed === null) {
                  this.t.ticketsUsed = 0;
                }
                this.t.ticketsUsed += 1;
                this.t.accessDate = dayjs().toISOString();
                if (this.reservation.eventId !== this.checkEventId) {
                  this.presentWrongEvent();
                } else if (this.reservation.accessEvent === 1 && this.t.ticketsUsed > this.t.amount) {
                  this.presentInvalidTicket(dayjs(this.reservation.accessDate));
                } else {
                  this.presentValidTicket();
                  this.reservation.accessEvent = 1;
                  this.reservation.accessDate = dayjs(new Date()).toString();
                  this.databaseService.updateReservation(this.reservation);
                  this.databaseService.updateTicket(this.t);
                }
              });
            }
          });
        })
        .catch((error) => {
          alert(error);
        });
    });
  }

  onChange(e: any) {
    this.checkEventId = Number(e.target.value);
    // this.sync();
  }

  async notOwnEvent() {
    const toast = await this.toastController.create({
      message: 'Not a ticket from this event.',
      duration: 4000,
      color: 'success',
    });
    toast.present();
  }

  async presentValidTicket() {
    this.showInfo = true;
    const toast = await this.toastController.create({
      message: this.translate.instant('VALID_TICKET'),
      duration: 4000,
      color: 'success',
    });
    toast.present();
  }

  async presentInvalidTicket(date: dayjs.Dayjs) {
    this.showInfo = false;
    const toast = await this.toastController.create({
      message:
        this.translate.instant('INVALID_TICKET') +
        '. <br/>' +
        this.translate.instant('USED') +
        ' ' +
        this.datePipe.transform(dayjs(date).toDate(), 'medium'),
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  async presentWrongEvent() {
    this.showInfo = false;
    const toast = await this.toastController.create({
      message: this.translate.instant('TICKET_NOT_FROM_EVENT'),
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  goBackToHomePage(): void {
    this.navController.navigateRoot('');
  }
}
