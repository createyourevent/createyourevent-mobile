import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { FeeTransaction } from './fee-transaction.model';

@Injectable({ providedIn: 'root' })
export class FeeTransactionService {
  private resourceUrl = ApiService.API_URL + '/fee-transactions';

  constructor(protected http: HttpClient) {}

  create(feeTransaction: FeeTransaction): Observable<HttpResponse<FeeTransaction>> {
    return this.http.post<FeeTransaction>(this.resourceUrl, feeTransaction, { observe: 'response' });
  }

  update(feeTransaction: FeeTransaction): Observable<HttpResponse<FeeTransaction>> {
    return this.http.put(`${this.resourceUrl}/${feeTransaction.id}`, feeTransaction, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<FeeTransaction>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<FeeTransaction[]>> {
    const options = createRequestOption(req);
    return this.http.get<FeeTransaction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
