import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ServiceLikeDislike } from './service-like-dislike.model';

@Injectable({ providedIn: 'root' })
export class ServiceLikeDislikeService {
  private resourceUrl = ApiService.API_URL + '/service-like-dislikes';

  constructor(protected http: HttpClient) {}

  create(serviceLikeDislike: ServiceLikeDislike): Observable<HttpResponse<ServiceLikeDislike>> {
    return this.http.post<ServiceLikeDislike>(this.resourceUrl, serviceLikeDislike, { observe: 'response' });
  }

  update(serviceLikeDislike: ServiceLikeDislike): Observable<HttpResponse<ServiceLikeDislike>> {
    return this.http.put(`${this.resourceUrl}/${serviceLikeDislike.id}`, serviceLikeDislike, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ServiceLikeDislike>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ServiceLikeDislike[]>> {
    const options = createRequestOption(req);
    return this.http.get<ServiceLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
