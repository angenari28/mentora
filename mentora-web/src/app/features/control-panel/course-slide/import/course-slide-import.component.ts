import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'app/services/course.service';
import { CourseSlideService } from 'app/services/course-slide.service';
import { CourseResponse } from 'app/services/responses/course.response';

@Component({
  selector: 'app-course-slide-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-slide-import.component.html',
  styleUrl: './course-slide-import.component.css'
})
export class CourseSlideImportComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly courseSlideService = inject(CourseSlideService);

  readonly courseId = signal<string>('');
  readonly course = signal<CourseResponse | null>(null);
  private readonly slideTypeId = signal<string>('');
  readonly selectedFile = signal<File | null>(null);
  readonly importing = signal(false);
  readonly importError = signal<string | null>(null);
  readonly importSuccess = signal<string | null>(null);
  readonly loadingCourse = signal(false);

  readonly canSubmit = computed(() =>
    !!this.selectedFile() && !!this.slideTypeId() && !this.importing()
  );

  ngOnInit(): void {
    const courseId = this.route.snapshot.queryParamMap.get('courseId') ?? '';
    this.courseId.set(courseId);

    if (courseId) {
      this.loadingCourse.set(true);
      this.courseService.getById(courseId).subscribe({
        next: (res) => {
          if (res.success) this.course.set(res.data);
          this.loadingCourse.set(false);
        },
        error: () => this.loadingCourse.set(false)
      });
    }

    this.courseSlideService.getSlideTypes().subscribe({
      next: (res) => {
        if (res.success) this.slideTypeId.set(res.data[0]?.id ?? '');
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedFile.set(file);
    this.importError.set(null);
    this.importSuccess.set(null);
  }

  submit(): void {
    const file = this.selectedFile();
    const courseId = this.courseId();
    const slideTypeId = this.slideTypeId();
    if (!file || !courseId || !slideTypeId) return;

    this.importing.set(true);
    this.importError.set(null);
    this.importSuccess.set(null);

    this.courseSlideService.importPptx(courseId, slideTypeId, file).subscribe({
      next: (res) => {
        if (res.success) {
          this.importSuccess.set(`${res.data.length} slides importados com sucesso!`);
          setTimeout(() => this.router.navigate(
            ['/control-panel/course-slide'],
            { queryParams: { courseId } }
          ), 1500);
        } else {
          this.importError.set(res.message);
        }
        this.importing.set(false);
      },
      error: (err) => {
        this.importError.set(err?.error?.message ?? 'Erro ao importar apresentação.');
        this.importing.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/control-panel/course-slide']);
  }
}
