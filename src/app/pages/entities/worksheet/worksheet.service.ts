import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Worksheet } from './worksheet.model';

@Injectable({ providedIn: 'root' })
export class WorksheetService {
  private resourceUrl = ApiService.API_URL + '/worksheets';

  constructor(protected http: HttpClient) {}

  create(worksheet: Worksheet): Observable<HttpResponse<Worksheet>> {
    return this.http.post<Worksheet>(this.resourceUrl, worksheet, { observe: 'response' });
  }

  update(worksheet: Worksheet): Observable<HttpResponse<Worksheet>> {
    return this.http.put(`${this.resourceUrl}/${worksheet.id}`, worksheet, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Worksheet>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Worksheet[]>> {
    const options = createRequestOption(req);
    return this.http.get<Worksheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
