import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem } from './responses/shared/list-item.response';
import { Workspace } from './responses/workspace.response';
import { WorkspaceRequest } from './requests/workspace.request';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private readonly http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/workspace`;

  getAll(page: number = 1, pageSize: number = 10, sortBy?: string, sortDescending?: boolean): Observable<{ success: boolean; message: string; data: ListItem<Workspace> }> {
    let url = `${this.baseUrl}?pageNumber=${page}&pageSize=${pageSize}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortDescending) url += `&sortDescending=${sortDescending}`;

    return this.http.get<{ success: boolean; message: string; data: ListItem<Workspace> }>(url);
  }

  getById(id: string): Observable<{ success: boolean; message: string; data: Workspace }> {
    return this.http.get<{ success: boolean; message: string; data: Workspace }>(`${this.baseUrl}/${id}`);
  }

  create(request: WorkspaceRequest): Observable<{ success: boolean; message: string; data: Workspace }> {
    return this.http.post<{ success: boolean; message: string; data: Workspace }>(this.baseUrl, request);
  }

  update(id: string, request: WorkspaceRequest): Observable<{ success: boolean; message: string; data: Workspace }> {
    return this.http.put<{ success: boolean; message: string; data: Workspace }>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }

  addLocalStorage(workspace: Workspace): void {
    localStorage.setItem('current_workspace', JSON.stringify(workspace));
  }
}

