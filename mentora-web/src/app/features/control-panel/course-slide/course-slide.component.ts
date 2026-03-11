import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CourseSlideService } from 'app/services/course-slide.service';
import { CourseService } from 'app/services/course.service';
import { CourseSlideResponse } from 'app/services/responses/course-slide.response';
import { CourseResponse } from 'app/services/responses/course.response';
import { TableComponent } from '@components/table/table.component';

@Component({
  selector: 'app-course-slide',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, TableComponent],
  templateUrl: './course-slide.component.html',
  styleUrl: './course-slide.component.css'
})
export class CourseSlideComponent implements OnInit {
  private readonly courseSlideService = inject(CourseSlideService);
  private readonly courseService = inject(CourseService);

  courses = signal<CourseResponse[]>([]);
  selectedCourseId = signal<string>('');
  slides = signal<CourseSlideResponse[]>([]);
  loading = signal(false);
  loadingCourses = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadingCourses.set(true);
    this.courseService.getAll(1, 100).subscribe({
      next: (res) => {
        if (res.success) this.courses.set(res.data.items);
        this.loadingCourses.set(false);
      },
      error: () => this.loadingCourses.set(false)
    });
  }

  onCourseChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCourseId.set(value);
    if (value) this.loadSlides(value);
    else this.slides.set([]);
  }

  loadSlides(courseId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.courseSlideService.getByCourse(courseId).subscribe({
      next: (res) => {
        if (res.success) this.slides.set(res.data);
        else this.error.set(res.message);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar slides.');
        this.loading.set(false);
      }
    });
  }

  deleteSlide(id: string): void {
    if (!confirm('Tem certeza que deseja remover este slide?')) return;
    this.courseSlideService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.slides.update(list => list.filter(s => s.id !== id));
        }
      },
      error: () => this.error.set('Erro ao remover slide.')
    });
  }

  trackById(_: number, slide: CourseSlideResponse): string {
    return slide.id;
  }
}
