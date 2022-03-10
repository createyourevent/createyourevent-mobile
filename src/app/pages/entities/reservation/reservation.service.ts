import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Reservation } from './reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private resourceUrl = ApiService.API_URL + '/reservations';

  constructor(protected http: HttpClient) {}

  create(reservation: Reservation): Observable<HttpResponse<Reservation>> {
    return this.http.post<Reservation>(this.resourceUrl, reservation, { observe: 'response' });
  }

  update(reservation: Reservation): Observable<HttpResponse<Reservation>> {
    return this.http.put(`${this.resourceUrl}/${reservation.id}`, reservation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Reservation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Reservation[]>> {
    const options = createRequestOption(req);
    return this.http.get<Reservation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
