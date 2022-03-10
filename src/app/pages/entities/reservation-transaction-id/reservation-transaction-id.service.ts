import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ReservationTransactionId } from './reservation-transaction-id.model';

@Injectable({ providedIn: 'root' })
export class ReservationTransactionIdService {
  private resourceUrl = ApiService.API_URL + '/reservation-transaction-ids';

  constructor(protected http: HttpClient) {}

  create(reservationTransactionId: ReservationTransactionId): Observable<HttpResponse<ReservationTransactionId>> {
    return this.http.post<ReservationTransactionId>(this.resourceUrl, reservationTransactionId, { observe: 'response' });
  }

  update(reservationTransactionId: ReservationTransactionId): Observable<HttpResponse<ReservationTransactionId>> {
    return this.http.put(`${this.resourceUrl}/${reservationTransactionId.id}`, reservationTransactionId, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ReservationTransactionId>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ReservationTransactionId[]>> {
    const options = createRequestOption(req);
    return this.http.get<ReservationTransactionId[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
