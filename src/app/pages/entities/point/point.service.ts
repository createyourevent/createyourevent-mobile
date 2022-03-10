import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Point } from './point.model';

@Injectable({ providedIn: 'root' })
export class PointService {
  private resourceUrl = ApiService.API_URL + '/points';

  constructor(protected http: HttpClient) {}

  create(point: Point): Observable<HttpResponse<Point>> {
    return this.http.post<Point>(this.resourceUrl, point, { observe: 'response' });
  }

  update(point: Point): Observable<HttpResponse<Point>> {
    return this.http.put(`${this.resourceUrl}/${point.id}`, point, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Point>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Point[]>> {
    const options = createRequestOption(req);
    return this.http.get<Point[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
