import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDetailResponse, UserListResponse } from './responses/user-list.response';
import { UserRequest } from './requests/user.request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  getAll(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.baseUrl}/user`);
  }

  getById(id: string): Observable<UserDetailResponse> {
    return this.http.get<UserDetailResponse>(`${this.baseUrl}/user/${id}`);
  }

  create(request: UserRequest): Observable<UserDetailResponse> {
    return this.http.post<UserDetailResponse>(`${this.baseUrl}/user`, request);
  }

  update(id: string, request: UserRequest): Observable<UserDetailResponse> {
    return this.http.put<UserDetailResponse>(`${this.baseUrl}/user/${id}`, request);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/user/${id}`);
  }
}

