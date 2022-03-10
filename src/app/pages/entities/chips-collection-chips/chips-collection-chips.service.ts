import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ChipsCollectionChips } from './chips-collection-chips.model';

@Injectable({ providedIn: 'root' })
export class ChipsCollectionChipsService {
  private resourceUrl = ApiService.API_URL + '/chips-collection-chips';

  constructor(protected http: HttpClient) {}

  create(chipsCollectionChips: ChipsCollectionChips): Observable<HttpResponse<ChipsCollectionChips>> {
    return this.http.post<ChipsCollectionChips>(this.resourceUrl, chipsCollectionChips, { observe: 'response' });
  }

  update(chipsCollectionChips: ChipsCollectionChips): Observable<HttpResponse<ChipsCollectionChips>> {
    return this.http.put(`${this.resourceUrl}/${chipsCollectionChips.id}`, chipsCollectionChips, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ChipsCollectionChips>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ChipsCollectionChips[]>> {
    const options = createRequestOption(req);
    return this.http.get<ChipsCollectionChips[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
