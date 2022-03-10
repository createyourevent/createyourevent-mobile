import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { OrganizationComment } from './organization-comment.model';

@Injectable({ providedIn: 'root' })
export class OrganizationCommentService {
  private resourceUrl = ApiService.API_URL + '/organization-comments';

  constructor(protected http: HttpClient) {}

  create(organizationComment: OrganizationComment): Observable<HttpResponse<OrganizationComment>> {
    return this.http.post<OrganizationComment>(this.resourceUrl, organizationComment, { observe: 'response' });
  }

  update(organizationComment: OrganizationComment): Observable<HttpResponse<OrganizationComment>> {
    return this.http.put(`${this.resourceUrl}/${organizationComment.id}`, organizationComment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<OrganizationComment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<OrganizationComment[]>> {
    const options = createRequestOption(req);
    return this.http.get<OrganizationComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
