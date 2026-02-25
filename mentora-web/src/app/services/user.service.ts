import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDetailResponse, UserListResponse } from './responses/user-list.response';

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
}
