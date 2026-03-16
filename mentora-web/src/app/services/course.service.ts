import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ListItem } from './responses/shared/list-item.response';
import { CourseResponse } from './responses/course.response';
import { CourseRequest } from './requests/course.request';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/course`;

  getAll(page: number = 1, pageSize: number = 10, sortBy?: string, sortDescending?: boolean): Observable<{ success: boolean; message: string; data: ListItem<CourseResponse> }> {
    let url = `${this.baseUrl}?pageNumber=${page}&pageSize=${pageSize}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortDescending !== undefined) url += `&sortDescending=${sortDescending}`;
    return this.http.get<{ success: boolean; message: string; data: ListItem<CourseResponse> }>(url);
  }

  getById(id: string): Observable<{ success: boolean; message: string; data: CourseResponse }> {
    return this.http.get<{ success: boolean; message: string; data: CourseResponse }>(`${this.baseUrl}/${id}`);
  }

  create(request: CourseRequest): Observable<{ success: boolean; message: string; data: CourseResponse }> {
    return this.http.post<{ success: boolean; message: string; data: CourseResponse }>(this.baseUrl, request);
  }

  update(id: string, request: CourseRequest): Observable<{ success: boolean; message: string; data: CourseResponse }> {
    return this.http.put<{ success: boolean; message: string; data: CourseResponse }>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }
}
