import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { OrganizationLikeDislike } from './organization-like-dislike.model';

@Injectable({ providedIn: 'root' })
export class OrganizationLikeDislikeService {
  private resourceUrl = ApiService.API_URL + '/organization-like-dislikes';

  constructor(protected http: HttpClient) {}

  create(organizationLikeDislike: OrganizationLikeDislike): Observable<HttpResponse<OrganizationLikeDislike>> {
    return this.http.post<OrganizationLikeDislike>(this.resourceUrl, organizationLikeDislike, { observe: 'response' });
  }

  update(organizationLikeDislike: OrganizationLikeDislike): Observable<HttpResponse<OrganizationLikeDislike>> {
    return this.http.put(`${this.resourceUrl}/${organizationLikeDislike.id}`, organizationLikeDislike, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<OrganizationLikeDislike>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<OrganizationLikeDislike[]>> {
    const options = createRequestOption(req);
    return this.http.get<OrganizationLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
