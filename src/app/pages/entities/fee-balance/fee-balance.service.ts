import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { FeeBalance } from './fee-balance.model';

@Injectable({ providedIn: 'root' })
export class FeeBalanceService {
  private resourceUrl = ApiService.API_URL + '/fee-balances';

  constructor(protected http: HttpClient) {}

  create(feeBalance: FeeBalance): Observable<HttpResponse<FeeBalance>> {
    return this.http.post<FeeBalance>(this.resourceUrl, feeBalance, { observe: 'response' });
  }

  update(feeBalance: FeeBalance): Observable<HttpResponse<FeeBalance>> {
    return this.http.put(`${this.resourceUrl}/${feeBalance.id}`, feeBalance, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<FeeBalance>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<FeeBalance[]>> {
    const options = createRequestOption(req);
    return this.http.get<FeeBalance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
