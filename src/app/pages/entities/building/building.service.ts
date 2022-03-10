import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Building } from './building.model';

@Injectable({ providedIn: 'root' })
export class BuildingService {
  private resourceUrl = ApiService.API_URL + '/buildings';

  constructor(protected http: HttpClient) {}

  create(building: Building): Observable<HttpResponse<Building>> {
    return this.http.post<Building>(this.resourceUrl, building, { observe: 'response' });
  }

  update(building: Building): Observable<HttpResponse<Building>> {
    return this.http.put(`${this.resourceUrl}/${building.id}`, building, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Building>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Building[]>> {
    const options = createRequestOption(req);
    return this.http.get<Building[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
