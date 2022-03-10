import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventProductRatingComment } from './event-product-rating-comment.model';

@Injectable({ providedIn: 'root' })
export class EventProductRatingCommentService {
  private resourceUrl = ApiService.API_URL + '/event-product-rating-comments';

  constructor(protected http: HttpClient) {}

  create(eventProductRatingComment: EventProductRatingComment): Observable<HttpResponse<EventProductRatingComment>> {
    return this.http.post<EventProductRatingComment>(this.resourceUrl, eventProductRatingComment, { observe: 'response' });
  }

  update(eventProductRatingComment: EventProductRatingComment): Observable<HttpResponse<EventProductRatingComment>> {
    return this.http.put(`${this.resourceUrl}/${eventProductRatingComment.id}`, eventProductRatingComment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventProductRatingComment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventProductRatingComment[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventProductRatingComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
