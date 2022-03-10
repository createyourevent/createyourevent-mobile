import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Bond } from './bond.model';

@Injectable({ providedIn: 'root' })
export class BondService {
  private resourceUrl = ApiService.API_URL + '/bonds';

  constructor(protected http: HttpClient) {}

  create(bond: Bond): Observable<HttpResponse<Bond>> {
    return this.http.post<Bond>(this.resourceUrl, bond, { observe: 'response' });
  }

  update(bond: Bond): Observable<HttpResponse<Bond>> {
    return this.http.put(`${this.resourceUrl}/${bond.id}`, bond, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Bond>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Bond[]>> {
    const options = createRequestOption(req);
    return this.http.get<Bond[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
