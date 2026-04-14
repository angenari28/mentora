import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem } from './responses/shared/list-item.response';
import { ClassStudentResponse } from './responses/class-student.response';
import { ClassStudentRequest } from './requests/class-student.request';
import { StudentClassesResponse } from './responses/student-classes.response';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassStudentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/classstudent`;

  getAll(
    page: number = 1,
    pageSize: number = 10,
    sortBy?: string,
    sortDescending?: boolean,
    workspaceId?: string
  ): Observable<{ success: boolean; message: string; data: ListItem<ClassStudentResponse> }> {
    let url = `${this.baseUrl}?pageNumber=${page}&pageSize=${pageSize}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortDescending !== undefined) url += `&sortDescending=${sortDescending}`;
    if (workspaceId) url += `&workspaceId=${workspaceId}`;
    return this.http.get<{ success: boolean; message: string; data: ListItem<ClassStudentResponse> }>(url);
  }

  getById(id: string): Observable<{ success: boolean; message: string; data: ClassStudentResponse }> {
    return this.http.get<{ success: boolean; message: string; data: ClassStudentResponse }>(`${this.baseUrl}/${id}`);
  }

  create(request: ClassStudentRequest): Observable<{ success: boolean; message: string; data: ClassStudentResponse }> {
    return this.http.post<{ success: boolean; message: string; data: ClassStudentResponse }>(this.baseUrl, request);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }

  getByStudentId(userId: string): Observable<{ success: boolean; message: string; data: StudentClassesResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: StudentClassesResponse[] }>(`${this.baseUrl}/student/${userId}`);
  }
}
