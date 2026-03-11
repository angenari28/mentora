import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { CourseSlideResponse } from './responses/course-slide.response';
import { CourseSlideRequest } from './requests/course-slide.request';
import { SlideTypeResponse } from './responses/slide-type.response';

@Injectable({
  providedIn: 'root'
})
export class CourseSlideService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/courseslide`;
  private readonly slideTypeUrl = `${environment.apiUrl}/slidetype`;

  getSlideTypes(): Observable<{ success: boolean; message: string; data: SlideTypeResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: SlideTypeResponse[] }>(
      this.slideTypeUrl
    );
  }

  getByCourse(courseId: string): Observable<{ success: boolean; message: string; data: CourseSlideResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: CourseSlideResponse[] }>(
      `${this.baseUrl}/course/${courseId}`
    );
  }

  getById(id: string): Observable<{ success: boolean; message: string; data: CourseSlideResponse }> {
    return this.http.get<{ success: boolean; message: string; data: CourseSlideResponse }>(
      `${this.baseUrl}/${id}`
    );
  }

  create(request: CourseSlideRequest): Observable<{ success: boolean; message: string; data: CourseSlideResponse }> {
    return this.http.post<{ success: boolean; message: string; data: CourseSlideResponse }>(
      this.baseUrl,
      request
    );
  }

  update(id: string, request: CourseSlideRequest): Observable<{ success: boolean; message: string; data: CourseSlideResponse }> {
    return this.http.put<{ success: boolean; message: string; data: CourseSlideResponse }>(
      `${this.baseUrl}/${id}`,
      request
    );
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }
}
