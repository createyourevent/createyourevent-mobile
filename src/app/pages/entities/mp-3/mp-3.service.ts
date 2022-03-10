import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Mp3 } from './mp-3.model';

@Injectable({ providedIn: 'root' })
export class Mp3Service {
  private resourceUrl = ApiService.API_URL + '/mp-3-s';

  constructor(protected http: HttpClient) {}

  create(mp3: Mp3): Observable<HttpResponse<Mp3>> {
    return this.http.post<Mp3>(this.resourceUrl, mp3, { observe: 'response' });
  }

  update(mp3: Mp3): Observable<HttpResponse<Mp3>> {
    return this.http.put(`${this.resourceUrl}/${mp3.id}`, mp3, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Mp3>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Mp3[]>> {
    const options = createRequestOption(req);
    return this.http.get<Mp3[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
