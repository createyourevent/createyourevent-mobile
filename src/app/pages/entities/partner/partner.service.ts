import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Partner } from './partner.model';

@Injectable({ providedIn: 'root' })
export class PartnerService {
  private resourceUrl = ApiService.API_URL + '/partners';

  constructor(protected http: HttpClient) {}

  create(partner: Partner): Observable<HttpResponse<Partner>> {
    return this.http.post<Partner>(this.resourceUrl, partner, { observe: 'response' });
  }

  update(partner: Partner): Observable<HttpResponse<Partner>> {
    return this.http.put(`${this.resourceUrl}/${partner.id}`, partner, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Partner>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Partner[]>> {
    const options = createRequestOption(req);
    return this.http.get<Partner[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
