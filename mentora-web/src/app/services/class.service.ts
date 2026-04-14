import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem } from './responses/shared/list-item.response';
import { ClassResponse } from './responses/class.response';
import { ClassRequest } from './requests/class.request';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/class`;

  getAll(page: number = 1, pageSize: number = 10, sortBy?: string, sortDescending?: boolean, workspaceId?: string): Observable<{ success: boolean; message: string; data: ListItem<ClassResponse> }> {
    let url = `${this.baseUrl}?pageNumber=${page}&pageSize=${pageSize}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortDescending !== undefined) url += `&sortDescending=${sortDescending}`;
    if (workspaceId) url += `&workspaceId=${workspaceId}`;
    return this.http.get<{ success: boolean; message: string; data: ListItem<ClassResponse> }>(url);
  }

  getById(id: string): Observable<{ success: boolean; message: string; data: ClassResponse }> {
    return this.http.get<{ success: boolean; message: string; data: ClassResponse }>(`${this.baseUrl}/${id}`);
  }

  getByWorkspace(workspaceId: string): Observable<{ success: boolean; message: string; data: ClassResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: ClassResponse[] }>(`${this.baseUrl}/workspace/${workspaceId}`);
  }

  getByCourse(courseId: string): Observable<{ success: boolean; message: string; data: ClassResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: ClassResponse[] }>(`${this.baseUrl}/course/${courseId}`);
  }

  create(request: ClassRequest): Observable<{ success: boolean; message: string; data: ClassResponse }> {
    return this.http.post<{ success: boolean; message: string; data: ClassResponse }>(this.baseUrl, request);
  }

  update(id: string, request: ClassRequest): Observable<{ success: boolean; message: string; data: ClassResponse }> {
    return this.http.put<{ success: boolean; message: string; data: ClassResponse }>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }
}
