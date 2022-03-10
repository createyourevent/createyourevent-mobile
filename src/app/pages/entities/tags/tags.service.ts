import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Tags } from './tags.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private resourceUrl = ApiService.API_URL + '/tags';

  constructor(protected http: HttpClient) {}

  create(tags: Tags): Observable<HttpResponse<Tags>> {
    return this.http.post<Tags>(this.resourceUrl, tags, { observe: 'response' });
  }

  update(tags: Tags): Observable<HttpResponse<Tags>> {
    return this.http.put(`${this.resourceUrl}/${tags.id}`, tags, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Tags>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Tags[]>> {
    const options = createRequestOption(req);
    return this.http.get<Tags[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
