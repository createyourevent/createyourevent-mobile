import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventLikeDislike } from './event-like-dislike.model';

@Injectable({ providedIn: 'root' })
export class EventLikeDislikeService {
  private resourceUrl = ApiService.API_URL + '/event-like-dislikes';

  constructor(protected http: HttpClient) {}

  create(eventLikeDislike: EventLikeDislike): Observable<HttpResponse<EventLikeDislike>> {
    return this.http.post<EventLikeDislike>(this.resourceUrl, eventLikeDislike, { observe: 'response' });
  }

  update(eventLikeDislike: EventLikeDislike): Observable<HttpResponse<EventLikeDislike>> {
    return this.http.put(`${this.resourceUrl}/${eventLikeDislike.id}`, eventLikeDislike, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventLikeDislike>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventLikeDislike[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
