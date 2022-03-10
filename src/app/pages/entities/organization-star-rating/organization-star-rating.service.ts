import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { OrganizationStarRating } from './organization-star-rating.model';

@Injectable({ providedIn: 'root' })
export class OrganizationStarRatingService {
  private resourceUrl = ApiService.API_URL + '/organization-star-ratings';

  constructor(protected http: HttpClient) {}

  create(organizationStarRating: OrganizationStarRating): Observable<HttpResponse<OrganizationStarRating>> {
    return this.http.post<OrganizationStarRating>(this.resourceUrl, organizationStarRating, { observe: 'response' });
  }

  update(organizationStarRating: OrganizationStarRating): Observable<HttpResponse<OrganizationStarRating>> {
    return this.http.put(`${this.resourceUrl}/${organizationStarRating.id}`, organizationStarRating, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<OrganizationStarRating>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<OrganizationStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<OrganizationStarRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
