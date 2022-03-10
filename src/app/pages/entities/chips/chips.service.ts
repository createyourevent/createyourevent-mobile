import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Chips } from './chips.model';

@Injectable({ providedIn: 'root' })
export class ChipsService {
  private resourceUrl = ApiService.API_URL + '/chips';

  constructor(protected http: HttpClient) {}

  create(chips: Chips): Observable<HttpResponse<Chips>> {
    return this.http.post<Chips>(this.resourceUrl, chips, { observe: 'response' });
  }

  update(chips: Chips): Observable<HttpResponse<Chips>> {
    return this.http.put(`${this.resourceUrl}/${chips.id}`, chips, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Chips>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Chips[]>> {
    const options = createRequestOption(req);
    return this.http.get<Chips[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
