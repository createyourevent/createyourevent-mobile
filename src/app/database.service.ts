import { GeneralService } from './general.service';
import { Platform } from '@ionic/angular';
import { Injectable, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reservation } from './pages/entities/reservation/reservation.model';
import * as dayjs from 'dayjs';

export class ReservationSQLite {
  id: number;
  date: string;
  billed: number;
  accessEvent: number;
  accessDate: string;
  userId: string;
  eventId: number;
  ticketId: number;
}

export class TicketSQLite {
  id: number;
  amount: number;
  total: number;
  date: string;
  refNo: string;
  accessDate: string;
  eventId: number;
  userId: string;
  ticketsUsed: number;
  reservationId: number;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  reservations = new BehaviorSubject([]);
  tickets = new BehaviorSubject([]);

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform, private sqlite: SQLite, private generalService: GeneralService) {
    this.plt.ready().then(() => {
      this.sqlite
        .create({
          name: 'off.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          //this.seedDatabase();
          this.loadReservations();
          this.loadTickets();
        });
    });
  }

  deleteDatabase() {
    this.sqlite
      .deleteDatabase({
        name: 'off.db',
        location: 'default',
      })
      .then(() => {
        this.plt.ready().then(() => {
          this.sqlite
            .create({
              name: 'off.db',
              location: 'default',
            })
            .then((db: SQLiteObject) => {
              this.database = db;
              this.seedDatabase();
              this.loadReservations();
              this.loadTickets();
            });
        });
      })
      .catch((e) => console.log(e));
  }

  seedDatabase(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.database) {
        this.database.executeSql('DROP TABLE IF EXISTS ticket');
        this.database.executeSql(
          'CREATE TABLE ticket (' +
            'id INTEGER PRIMARY KEY,' +
            'amount INTEGER,' +
            'total REAL,' +
            'date TEXT,' +
            'refNo TEXT,' +
            'accessDate TEXT,' +
            'eventId INTEGER,' +
            'userId TEXT,' +
            'ticketsUsed INTEGER,' +
            'reservationId TEXT' +
            ');'
        );
        // **
        // this.database.transaction((trx) => {
        this.database.executeSql('DROP TABLE IF EXISTS reservations');
        this.database.executeSql(
          'CREATE TABLE reservations (' +
            'id INTEGER PRIMARY KEY,' +
            'date TEXT,' +
            'billed INTEGER,' +
            'accessEvent INTEGER,' +
            'accessDate TEXT,' +
            'userId TEXT,' +
            'eventId INTEGER,' +
            'ticketId INTEGER' +
            ');'
        );
        this.database.executeSql('DROP TABLE IF EXISTS reservationinfo');
        this.database.executeSql(
          'CREATE TABLE reservationinfo (' + 'id INTEGER PRIMARY KEY,' + 'name TEXT,' + 'date TEXT,' + 'eventId INTEGER' + ');'
        );
        //
        //});
        resolve(true);
      }
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getReservations(): Observable<ReservationSQLite[]> {
    return this.reservations.asObservable();
  }

  getTickets(): Observable<TicketSQLite[]> {
    return this.tickets.asObservable();
  }

  loadReservations() {
    return this.database.executeSql('SELECT * FROM reservations', []).then((data) => {
      const reservations: ReservationSQLite[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          reservations.push({
            id: data.rows.item(i).id,
            date: data.rows.item(i).date,
            billed: data.rows.item(i).billed,
            accessEvent: data.rows.item(i).accessEvent,
            accessDate: data.rows.item(i).accessDate,
            userId: data.rows.item(i).userId,
            eventId: data.rows.item(i).eventId,
            ticketId: data.rows.item(i).ticketId,
          });
        }
      }
      this.reservations.next(reservations);
    });
  }

  loadTickets() {
    return this.database.executeSql('SELECT * FROM ticket', []).then((data) => {
      const tickets: TicketSQLite[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tickets.push({
            id: data.rows.item(i).id,
            amount: data.rows.item(i).amount,
            total: data.rows.item(i).total,
            date: data.rows.item(i).date,
            accessDate: data.rows.item(i).accessDate,
            refNo: data.rows.item(i).refNo,
            ticketsUsed: data.rows.item(i).ticketsUsed,
            userId: data.rows.item(i).userId,
            eventId: data.rows.item(i).eventId,
            reservationId: data.rows.item(i).reservationId,
          });
        }
      }
      this.tickets.next(tickets);
    });
  }

  getReservation(id): Promise<ReservationSQLite> {
    return new Promise((r, reject) => {
      this.database.executeSql('SELECT * FROM reservations WHERE id = ?', [id]).then((data) => r(data.rows.item(0)));
    });
  }

  getTicket(id): Promise<TicketSQLite> {
    return new Promise((r, reject) => {
      this.database.executeSql('SELECT * FROM ticket WHERE id = ?', [id]).then((data) => r(data.rows.item(0)));
    });
  }

  updateReservation(res: ReservationSQLite) {
    const data = [res.accessEvent, res.accessDate];
    return this.database.executeSql(`UPDATE reservations SET accessEvent = ?, accessDate = ? WHERE id = ${res.id}`, data);
  }

  updateTicket(t: TicketSQLite) {
    const data = [t.ticketsUsed, t.accessDate];
    return this.database.executeSql(`UPDATE ticket SET ticketsUsed = ?, accessDate = ? WHERE id = ${t.id}`, data);
  }

  async getEventName(): Promise<string> {
    return new Promise((resolve, reject) => {
      let n = '';
      this.database.executeSql('SELECT * FROM reservationinfo WHERE id = ?', [1]).then((data) => {
        n = data.rows.item(0).name;
        resolve(n);
      });
    });
  }

  async getEventId(): Promise<number> {
    return new Promise((resolve, reject) => {
      let n = -1;
      this.database.executeSql('SELECT * FROM reservationinfo WHERE id = ?', [1]).then((data) => {
        n = data.rows.item(0).eventId;
        resolve(n);
      });
    });
  }

  insertReservationInfo(eventId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.generalService.findReservationsByEventId(eventId).subscribe((res) => {
        const reservations = res.body;
        let i = 0;
        reservations.forEach((element) => {
          if (i === 0) {
            this.database
              .executeSql('INSERT INTO reservationinfo (name, date, eventId) VALUES(?,?,?);', [
                element.event.name,
                dayjs(new Date()),
                element.event.id,
              ])
              .then(() => {
                resolve(true);
              });
          }
          i++;
        });
      });
    });
  }

  insertReservations(eventId: number) {
    this.generalService.findReservationsByEventId(eventId).subscribe((res) => {
      const reservations = res.body;
      reservations.forEach((element) => {
        this.database.executeSql(
          'INSERT INTO reservations (id, date, billed, accessEvent, accessDate, ' + 'userId, eventId, ticketId) VALUES(?,?,?,?,?,?,?,?);',
          [
            element.id,
            element.date,
            element.billed,
            element.accessEvent === false ? 0 : 1,
            element.accessDate,
            element.user.id,
            element.event.id,
            element.ticket.id,
          ]
        );
      });
    });
  }

  insertTickets(eventId: number) {
    this.generalService.findReservationsByEventId(eventId).subscribe((res) => {
      const tickets = res.body;
      tickets.forEach((element) => {
        this.database.executeSql(
          'INSERT INTO ticket (id, amount, total, date, refNo, eventId, userId, accessDate, ' +
            'ticketsUsed, reservationId) VALUES(?,?,?,?,?,?,?,?,?,?);',
          [
            element.ticket.id,
            element.ticket.amount,
            element.ticket.total,
            // element.accessEvent === false ? 0 : 1,
            element.ticket.date,
            element.ticket.refNo,
            element.event.id,
            element.user.id,
            element.ticket.accessDate === false ? 0 : 1,
            element.ticket.ticketsUsed,
            element.ticket.reservation.id,
          ]
        );
      });
    });
  }
}
