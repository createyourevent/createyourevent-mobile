import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventComment } from './event-comment.model';

@Injectable({ providedIn: 'root' })
export class EventCommentService {
  private resourceUrl = ApiService.API_URL + '/event-comments';

  constructor(protected http: HttpClient) {}

  create(eventComment: EventComment): Observable<HttpResponse<EventComment>> {
    return this.http.post<EventComment>(this.resourceUrl, eventComment, { observe: 'response' });
  }

  update(eventComment: EventComment): Observable<HttpResponse<EventComment>> {
    return this.http.put(`${this.resourceUrl}/${eventComment.id}`, eventComment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventComment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventComment[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
