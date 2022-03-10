import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { FeeTransactionEntry } from './fee-transaction-entry.model';

@Injectable({ providedIn: 'root' })
export class FeeTransactionEntryService {
  private resourceUrl = ApiService.API_URL + '/fee-transaction-entries';

  constructor(protected http: HttpClient) {}

  create(feeTransactionEntry: FeeTransactionEntry): Observable<HttpResponse<FeeTransactionEntry>> {
    return this.http.post<FeeTransactionEntry>(this.resourceUrl, feeTransactionEntry, { observe: 'response' });
  }

  update(feeTransactionEntry: FeeTransactionEntry): Observable<HttpResponse<FeeTransactionEntry>> {
    return this.http.put(`${this.resourceUrl}/${feeTransactionEntry.id}`, feeTransactionEntry, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<FeeTransactionEntry>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<FeeTransactionEntry[]>> {
    const options = createRequestOption(req);
    return this.http.get<FeeTransactionEntry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
