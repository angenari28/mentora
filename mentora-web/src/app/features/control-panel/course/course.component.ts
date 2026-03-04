import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseService } from 'app/services/course.service';
import { CourseResponse } from 'app/services/responses/course.response';
import { ListItem } from 'app/services/responses/shared/list-item.response';
import { WorkloadHoursPipe } from 'app/pipes/workload-hours.pipe';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, RouterModule, WorkloadHoursPipe],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  private readonly courseService = inject(CourseService);

  pagedCourses = signal<ListItem<CourseResponse>>({
    items: [],
    meta: { totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPrevious: false, hasNext: false }
  });
  currentPage = signal(1);
  readonly pageSize = 10;
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);
    this.courseService.getAll(this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        if (res.success) this.pagedCourses.set(res.data);
        else this.error.set(res.message);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar cursos.');
        this.loading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagedCourses().meta.totalPages) return;
    this.currentPage.set(page);
    this.loadCourses();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pagedCourses().meta.totalPages }, (_, i) => i + 1);
  }

  trackById(_: number, course: CourseResponse): string {
    return course.id;
  }
}
