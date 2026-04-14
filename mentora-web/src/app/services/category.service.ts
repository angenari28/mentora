import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem } from './responses/shared/list-item.response';
import { CategoryResponse } from './responses/category.response';
import { CategoryRequest } from './requests/category.request';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/category`;

  getAll(page: number = 1, pageSize: number = 10, sortBy?: string, sortDescending?: boolean, workspaceId?: string): Observable<{ success: boolean; message: string; data: ListItem<CategoryResponse> }> {
    let url = `${this.baseUrl}?pageNumber=${page}&pageSize=${pageSize}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortDescending !== undefined) url += `&sortDescending=${sortDescending}`;
    if (workspaceId) url += `&workspaceId=${workspaceId}`;

    return this.http.get<{ success: boolean; message: string; data: ListItem<CategoryResponse> }>(url);
  }

  create(request: CategoryRequest): Observable<{ success: boolean; message: string; data: CategoryResponse }> {
    return this.http.post<{ success: boolean; message: string; data: CategoryResponse }>(this.baseUrl, request);
  }
}
