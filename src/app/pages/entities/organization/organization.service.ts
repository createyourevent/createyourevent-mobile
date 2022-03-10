import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Organization } from './organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private resourceUrl = ApiService.API_URL + '/organizations';

  constructor(protected http: HttpClient) {}

  create(organization: Organization): Observable<HttpResponse<Organization>> {
    return this.http.post<Organization>(this.resourceUrl, organization, { observe: 'response' });
  }

  update(organization: Organization): Observable<HttpResponse<Organization>> {
    return this.http.put(`${this.resourceUrl}/${organization.id}`, organization, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Organization>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Organization[]>> {
    const options = createRequestOption(req);
    return this.http.get<Organization[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
