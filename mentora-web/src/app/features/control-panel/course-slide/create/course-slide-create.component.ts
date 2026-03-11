import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'app/services/course.service';
import { CourseSlideService } from 'app/services/course-slide.service';
import { CourseResponse } from 'app/services/responses/course.response';
import { CourseSlideResponse } from 'app/services/responses/course-slide.response';
import { SlideTypeResponse } from 'app/services/responses/slide-type.response';

interface ICourseSlide {
  courseId: string;
  slideTypeId: string;
  title: string;
  content: string;
  ordering: number;
  active: boolean;
}

@Component({
  selector: 'app-course-slide-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: './course-slide-create.component.html',
  styleUrls: ['./course-slide-create.component.css']
})
export class CourseSlideCreateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly courseSlideService = inject(CourseSlideService);

  @ViewChild('formEl') private readonly formEl!: ElementRef<HTMLFormElement>;

  readonly courses = signal<CourseResponse[]>([]);
  readonly loadingCourses = signal(false);
  readonly slideTypes = signal<SlideTypeResponse[]>([]);
  readonly loadingSlideTypes = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly editId = signal<string | null>(null);
  readonly isEdit = signal(false);
  readonly saveMenuOpen = signal(false);
  private readonly closeOnSave = signal(false);

  readonly slideBreadcrumbs = signal<CourseSlideResponse[]>([]);
  readonly activeBreadcrumbId = signal<string | null>(null);
  readonly loadingBreadcrumb = signal(false);

  private readonly model = signal<ICourseSlide>({
    courseId: '',
    slideTypeId: '',
    title: '',
    content: '',
    ordering: 1,
    active: true
  });

  private readonly selectedCourseId = computed(() => this.model().courseId);

  protected readonly formTitle = computed(() =>
    this.isEdit() ? `Editar Slide ${this.model().ordering}` : 'Novo Slide'
  );

  protected readonly selectedCourseName = computed(() => {
    const id = this.model().courseId;
    return this.courses().find(c => c.id === id)?.name ?? '';
  });

  constructor() {
    effect(() => {
      const courseId = this.selectedCourseId();
      if (courseId) {
        this.loadSlideBreadcrumb(courseId);
      } else {
        this.slideBreadcrumbs.set([]);
        this.activeBreadcrumbId.set(null);
      }
    }, { allowSignalWrites: true });
  }

  private loadSlideBreadcrumb(courseId: string): void {
    this.loadingBreadcrumb.set(true);
    this.courseSlideService.getByCourse(courseId).subscribe({
      next: (res) => {
        if (res.success) {
          this.slideBreadcrumbs.set(
            [...res.data].sort((a, b) => a.ordering - b.ordering)
          );
        }
        this.loadingBreadcrumb.set(false);
      },
      error: () => this.loadingBreadcrumb.set(false)
    });
  }

  protected readonly slideForm = form(
    this.model,
    (s) => {
      required(s.courseId, { message: 'O campo Curso é obrigatório.' });
      required(s.slideTypeId, { message: 'O campo Tipo de Slide é obrigatório.' });
      required(s.title, { message: 'O campo Título é obrigatório.' });
      maxLength(s.title, 200);
      required(s.content, { message: 'O campo Conteúdo é obrigatório.' });
      required(s.ordering, { message: 'O campo Ordenação é obrigatório.' });
    },
    {
      submission: {
        action: async (f) => {
          this.submitError.set(null);
          this.submitting.set(true);
          const value = f().value();

          const request = {
            courseId: value.courseId,
            slideTypeId: value.slideTypeId,
            title: value.title,
            content: value.content,
            ordering: value.ordering,
            active: value.active
          };

          return new Promise<void>((resolve, reject) => {
            const editId = this.editId();
            const obs = editId
              ? this.courseSlideService.update(editId, request)
              : this.courseSlideService.create(request);

            obs.subscribe({
              next: (res) => {
                this.submitting.set(false);
                const savedSlide = res.data;
                const currentEditId = editId;
                let updated: CourseSlideResponse[];
                if (currentEditId) {
                  updated = this.slideBreadcrumbs().map(s =>
                    s.id === currentEditId ? savedSlide : s
                  );
                } else {
                  updated = [...this.slideBreadcrumbs(), savedSlide];
                }
                this.slideBreadcrumbs.set(updated.sort((a, b) => a.ordering - b.ordering));
                this.editId.set(savedSlide.id);
                this.isEdit.set(true);
                this.activeBreadcrumbId.set(savedSlide.id);
                if (this.closeOnSave()) {
                  this.closeOnSave.set(false);
                  this.router.navigate(['/control-panel/course-slide']);
                }
                resolve();
              },
              error: (err) => {
                this.submitting.set(false);
                this.submitError.set('Erro ao salvar slide. Tente novamente.');
                console.error(err);
                reject(err);
              }
            });
          });
        },
        onInvalid: () => {
          console.warn('Formulário inválido.');
        }
      }
    }
  );

  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.queryParamMap.get('courseId');
    const editIdParam = this.route.snapshot.queryParamMap.get('editId');

    if (editIdParam) {
      this.editId.set(editIdParam);
      this.isEdit.set(true);
      this.activeBreadcrumbId.set(editIdParam);
      this.courseSlideService.getById(editIdParam).subscribe({
        next: (res) => {
          if (res.success) {
            this.model.set({
              courseId: res.data.courseId,
              slideTypeId: res.data.slideTypeId,
              title: res.data.title,
              content: res.data.content,
              ordering: res.data.ordering,
              active: res.data.active
            });
          }
        }
      });
    } else if (courseIdParam) {
      this.model.update(m => ({ ...m, courseId: courseIdParam }));
    }

    this.loadingCourses.set(true);
    this.courseService.getAll(1, 100).subscribe({
      next: (res) => {
        if (res.success) this.courses.set(res.data.items);
        this.loadingCourses.set(false);
      },
      error: () => this.loadingCourses.set(false)
    });

    this.loadingSlideTypes.set(true);
    this.courseSlideService.getSlideTypes().subscribe({
      next: (res) => {
        if (res.success) this.slideTypes.set(res.data);
        this.loadingSlideTypes.set(false);
      },
      error: () => this.loadingSlideTypes.set(false)
    });
  }

  close(): void {
    this.router.navigate(['/control-panel/course-slide']);
  }

  toggleSaveMenu(): void {
    this.saveMenuOpen.update(v => !v);
  }

  closeSaveMenu(): void {
    this.saveMenuOpen.set(false);
  }

  saveAndClose(): void {
    this.closeOnSave.set(true);
    this.closeSaveMenu();
    this.formEl.nativeElement.requestSubmit();
  }

  selectBreadcrumb(slide: CourseSlideResponse): void {
    this.editId.set(slide.id);
    this.isEdit.set(true);
    this.activeBreadcrumbId.set(slide.id);
    this.model.set({
      courseId: slide.courseId,
      slideTypeId: slide.slideTypeId,
      title: slide.title,
      content: slide.content,
      ordering: slide.ordering,
      active: slide.active
    });
    this.submitError.set(null);
  }

  newSlide(): void {
    const courseId = this.model().courseId;
    const maxOrdering = this.slideBreadcrumbs().reduce(
      (max, s) => Math.max(max, s.ordering), 0
    );
    this.editId.set(null);
    this.isEdit.set(false);
    this.activeBreadcrumbId.set(null);
    this.submitError.set(null);
    this.model.set({
      courseId,
      slideTypeId: '',
      title: '',
      content: '',
      ordering: maxOrdering + 1,
      active: true
    });
  }
}
