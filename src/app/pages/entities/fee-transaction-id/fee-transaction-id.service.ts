import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { FeeTransactionId } from './fee-transaction-id.model';

@Injectable({ providedIn: 'root' })
export class FeeTransactionIdService {
  private resourceUrl = ApiService.API_URL + '/fee-transaction-ids';

  constructor(protected http: HttpClient) {}

  create(feeTransactionId: FeeTransactionId): Observable<HttpResponse<FeeTransactionId>> {
    return this.http.post<FeeTransactionId>(this.resourceUrl, feeTransactionId, { observe: 'response' });
  }

  update(feeTransactionId: FeeTransactionId): Observable<HttpResponse<FeeTransactionId>> {
    return this.http.put(`${this.resourceUrl}/${feeTransactionId.id}`, feeTransactionId, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<FeeTransactionId>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<FeeTransactionId[]>> {
    const options = createRequestOption(req);
    return this.http.get<FeeTransactionId[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
