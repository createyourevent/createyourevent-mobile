import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ServiceMap } from './service-map.model';

@Injectable({ providedIn: 'root' })
export class ServiceMapService {
  private resourceUrl = ApiService.API_URL + '/service-maps';

  constructor(protected http: HttpClient) {}

  create(serviceMap: ServiceMap): Observable<HttpResponse<ServiceMap>> {
    return this.http.post<ServiceMap>(this.resourceUrl, serviceMap, { observe: 'response' });
  }

  update(serviceMap: ServiceMap): Observable<HttpResponse<ServiceMap>> {
    return this.http.put(`${this.resourceUrl}/${serviceMap.id}`, serviceMap, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ServiceMap>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ServiceMap[]>> {
    const options = createRequestOption(req);
    return this.http.get<ServiceMap[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
