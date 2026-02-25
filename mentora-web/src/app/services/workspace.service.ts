import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem } from './responses/shared/list-item.response';
import { Workspace } from './responses/workspace.response';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private readonly http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/workspace';

  getAll(page: number = 1, pageSize: number = 10, sortBy?: string, sortDescending?: boolean): Observable<{ success: boolean; message: string; data: ListItem<Workspace> }> {
    let url = `${this.baseUrl}?pageNumber=${page}&pageSize=${pageSize}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortDescending) url += `&sortDescending=${sortDescending}`;

    return this.http.get<{ success: boolean; message: string; data: ListItem<Workspace> }>(url);
  }

  getById(id: string): Observable<{ success: boolean; message: string; data: Workspace }> {
    return this.http.get<{ success: boolean; message: string; data: Workspace }>(`${this.baseUrl}/${id}`);
  }
}
