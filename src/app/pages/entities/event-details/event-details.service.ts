import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventDetails } from './event-details.model';

@Injectable({ providedIn: 'root' })
export class EventDetailsService {
  private resourceUrl = ApiService.API_URL + '/event-details';

  constructor(protected http: HttpClient) {}

  create(eventDetails: EventDetails): Observable<HttpResponse<EventDetails>> {
    return this.http.post<EventDetails>(this.resourceUrl, eventDetails, { observe: 'response' });
  }

  update(eventDetails: EventDetails): Observable<HttpResponse<EventDetails>> {
    return this.http.put(`${this.resourceUrl}/${eventDetails.id}`, eventDetails, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventDetails>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventDetails[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
