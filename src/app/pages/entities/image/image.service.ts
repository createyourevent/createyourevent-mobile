import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Image } from './image.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private resourceUrl = ApiService.API_URL + '/images';

  constructor(protected http: HttpClient) {}

  create(image: Image): Observable<HttpResponse<Image>> {
    return this.http.post<Image>(this.resourceUrl, image, { observe: 'response' });
  }

  update(image: Image): Observable<HttpResponse<Image>> {
    return this.http.put(`${this.resourceUrl}/${image.id}`, image, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Image>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Image[]>> {
    const options = createRequestOption(req);
    return this.http.get<Image[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
