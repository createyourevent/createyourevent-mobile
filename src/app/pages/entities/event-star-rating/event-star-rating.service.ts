import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventStarRating } from './event-star-rating.model';

@Injectable({ providedIn: 'root' })
export class EventStarRatingService {
  private resourceUrl = ApiService.API_URL + '/event-star-ratings';

  constructor(protected http: HttpClient) {}

  create(eventStarRating: EventStarRating): Observable<HttpResponse<EventStarRating>> {
    return this.http.post<EventStarRating>(this.resourceUrl, eventStarRating, { observe: 'response' });
  }

  update(eventStarRating: EventStarRating): Observable<HttpResponse<EventStarRating>> {
    return this.http.put(`${this.resourceUrl}/${eventStarRating.id}`, eventStarRating, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventStarRating>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventStarRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
