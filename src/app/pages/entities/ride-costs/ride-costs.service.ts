import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { RideCosts } from './ride-costs.model';

@Injectable({ providedIn: 'root' })
export class RideCostsService {
  private resourceUrl = ApiService.API_URL + '/ride-costs';

  constructor(protected http: HttpClient) {}

  create(rideCosts: RideCosts): Observable<HttpResponse<RideCosts>> {
    return this.http.post<RideCosts>(this.resourceUrl, rideCosts, { observe: 'response' });
  }

  update(rideCosts: RideCosts): Observable<HttpResponse<RideCosts>> {
    return this.http.put(`${this.resourceUrl}/${rideCosts.id}`, rideCosts, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<RideCosts>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<RideCosts[]>> {
    const options = createRequestOption(req);
    return this.http.get<RideCosts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
