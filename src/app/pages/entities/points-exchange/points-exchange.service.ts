import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { PointsExchange } from './points-exchange.model';

@Injectable({ providedIn: 'root' })
export class PointsExchangeService {
  private resourceUrl = ApiService.API_URL + '/points-exchanges';

  constructor(protected http: HttpClient) {}

  create(pointsExchange: PointsExchange): Observable<HttpResponse<PointsExchange>> {
    return this.http.post<PointsExchange>(this.resourceUrl, pointsExchange, { observe: 'response' });
  }

  update(pointsExchange: PointsExchange): Observable<HttpResponse<PointsExchange>> {
    return this.http.put(`${this.resourceUrl}/${pointsExchange.id}`, pointsExchange, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<PointsExchange>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<PointsExchange[]>> {
    const options = createRequestOption(req);
    return this.http.get<PointsExchange[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
