import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { CourseSlideTimeCreateRequest, CourseSlideTimeEndRequest } from './requests/course-slide-time.request';
import { CourseSlideTimeApiResponse } from './responses/course-slide-time.response';

@Injectable({
  providedIn: 'root'
})
export class CourseSlideTimeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/courseslidetime`;

  create(request: CourseSlideTimeCreateRequest): Observable<{ success: boolean; message: string; data: CourseSlideTimeApiResponse }> {
    return this.http.post<{ success: boolean; message: string; data: CourseSlideTimeApiResponse }>(
      this.baseUrl,
      request
    );
  }

  end(id: string, request: CourseSlideTimeEndRequest): Observable<{ success: boolean; message: string; data: CourseSlideTimeApiResponse }> {
    return this.http.patch<{ success: boolean; message: string; data: CourseSlideTimeApiResponse }>(
      `${this.baseUrl}/${id}/end`,
      request
    );
  }
}
