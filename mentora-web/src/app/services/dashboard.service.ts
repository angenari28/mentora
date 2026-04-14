import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { DashboardResponse } from './responses/dashboard.response';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getDashboard(workspaceId: string): Observable<{ success: boolean; message: string; data: DashboardResponse }> {
    return this.http.get<{ success: boolean; message: string; data: DashboardResponse }>(
      `${this.baseUrl}?workspaceId=${workspaceId}`
    );
  }
}
