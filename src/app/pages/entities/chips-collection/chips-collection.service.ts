import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ChipsCollection } from './chips-collection.model';

@Injectable({ providedIn: 'root' })
export class ChipsCollectionService {
  private resourceUrl = ApiService.API_URL + '/chips-collections';

  constructor(protected http: HttpClient) {}

  create(chipsCollection: ChipsCollection): Observable<HttpResponse<ChipsCollection>> {
    return this.http.post<ChipsCollection>(this.resourceUrl, chipsCollection, { observe: 'response' });
  }

  update(chipsCollection: ChipsCollection): Observable<HttpResponse<ChipsCollection>> {
    return this.http.put(`${this.resourceUrl}/${chipsCollection.id}`, chipsCollection, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ChipsCollection>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ChipsCollection[]>> {
    const options = createRequestOption(req);
    return this.http.get<ChipsCollection[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
