import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserListResponse } from './responses/user-list.response';

export interface StudentPaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  workspaceId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getStudents(params?: StudentPaginationParams): Observable<UserListResponse> {
    let queryString = '';
    if (params) {
      const parts: string[] = [];
      if (params.pageNumber !== undefined) parts.push(`pageNumber=${params.pageNumber}`);
      if (params.pageSize !== undefined) parts.push(`pageSize=${params.pageSize}`);
      if (params.sortBy) parts.push(`sortBy=${encodeURIComponent(params.sortBy)}`);
      if (params.sortDescending !== undefined) parts.push(`sortDescending=${params.sortDescending}`);
      if (params.workspaceId) parts.push(`workspaceId=${encodeURIComponent(params.workspaceId)}`);
      if (parts.length > 0) queryString = `?${parts.join('&')}`;
    }
    return this.http.get<UserListResponse>(`${this.baseUrl}/user/students${queryString}`);
  }
}
