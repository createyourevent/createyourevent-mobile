import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ServiceComment } from './service-comment.model';

@Injectable({ providedIn: 'root' })
export class ServiceCommentService {
  private resourceUrl = ApiService.API_URL + '/service-comments';

  constructor(protected http: HttpClient) {}

  create(serviceComment: ServiceComment): Observable<HttpResponse<ServiceComment>> {
    return this.http.post<ServiceComment>(this.resourceUrl, serviceComment, { observe: 'response' });
  }

  update(serviceComment: ServiceComment): Observable<HttpResponse<ServiceComment>> {
    return this.http.put(`${this.resourceUrl}/${serviceComment.id}`, serviceComment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ServiceComment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ServiceComment[]>> {
    const options = createRequestOption(req);
    return this.http.get<ServiceComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
