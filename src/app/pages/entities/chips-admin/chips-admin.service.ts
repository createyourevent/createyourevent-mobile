import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ChipsAdmin } from './chips-admin.model';

@Injectable({ providedIn: 'root' })
export class ChipsAdminService {
  private resourceUrl = ApiService.API_URL + '/chips-admins';

  constructor(protected http: HttpClient) {}

  create(chipsAdmin: ChipsAdmin): Observable<HttpResponse<ChipsAdmin>> {
    return this.http.post<ChipsAdmin>(this.resourceUrl, chipsAdmin, { observe: 'response' });
  }

  update(chipsAdmin: ChipsAdmin): Observable<HttpResponse<ChipsAdmin>> {
    return this.http.put(`${this.resourceUrl}/${chipsAdmin.id}`, chipsAdmin, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ChipsAdmin>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ChipsAdmin[]>> {
    const options = createRequestOption(req);
    return this.http.get<ChipsAdmin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
