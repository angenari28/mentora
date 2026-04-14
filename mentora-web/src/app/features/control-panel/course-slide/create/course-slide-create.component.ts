import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { CourseService } from 'app/services/course.service';
import { CourseSlideService } from 'app/services/course-slide.service';
import { CourseResponse } from 'app/services/responses/course.response';
import { CourseSlideResponse } from 'app/services/responses/course-slide.response';
import { SlideTypeResponse } from 'app/services/responses/slide-type.response';
import { WorkspaceService } from '@services/workspace.service';

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
  private readonly workspaceService = inject(WorkspaceService);

  @ViewChild('formEl') private readonly formEl!: ElementRef<HTMLFormElement>;
  @ViewChild('slideImageInput') private readonly slideImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('richEditor') private readonly richEditor?: ElementRef<HTMLDivElement>;

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

  protected readonly isImageType = computed(() => {
    const selectedId = (this.slideForm().value()?.slideTypeId ?? '') as string;
    const type = this.slideTypes().find(t => t.id === selectedId);
    return type?.name === 'Imagem';
  });

  protected readonly isVideoType = computed(() => {
    const selectedId = (this.slideForm().value()?.slideTypeId ?? '') as string;
    const type = this.slideTypes().find(t => t.id === selectedId);
    return type?.name === 'Vídeo';
  });

  protected readonly imagePreviewUrl = computed(() => {
    const content = (this.slideForm().value()?.content ?? '') as string;
    if (!content) return '';
    if (content.startsWith('/uploads/')) return `${environment.serverUrl}${content}`;
    return content;
  });

  readonly imageDisplayName = signal<string>('');

  private initImageDisplayName(content: string): void {
    if (!content) {
      this.imageDisplayName.set('');
    } else if (content.startsWith('data:')) {
      this.imageDisplayName.set('Imagem enviada');
    } else {
      this.imageDisplayName.set(content);
    }
  }

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

    effect(() => {
      const isImg = this.isImageType();
      const isVid = this.isVideoType();
      if (!isImg && !isVid) {
        const content = untracked(() => this.model().content);
        this.refreshEditor(content);
      }
    });
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
            this.initImageDisplayName(res.data.content);
            this.refreshEditor(res.data.content);
          }
        }
      });
    } else if (courseIdParam) {
      this.model.update(m => ({ ...m, courseId: courseIdParam }));
    }

    this.loadingCourses.set(true);
    this.courseService.getAll(1, 100, undefined, undefined, this.workspaceService.getCurrentWorkspaceId() ?? undefined).subscribe({
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
    this.initImageDisplayName(slide.content);
    this.refreshEditor(slide.content);
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
    this.imageDisplayName.set('');
    this.model.set({
      courseId,
      slideTypeId: '',
      title: '',
      content: '',
      ordering: maxOrdering + 1,
      active: true
    });
    this.refreshEditor('');
  }

  triggerSlideImageInput(): void {
    this.slideImageInput.nativeElement.click();
  }

  onImageUrlInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.imageDisplayName.set(value);
    const currentValue = this.slideForm().value();
    this.model.set({
      courseId: currentValue.courseId as string,
      slideTypeId: currentValue.slideTypeId as string,
      title: currentValue.title as string,
      content: value,
      ordering: Number(currentValue.ordering),
      active: Boolean(currentValue.active),
    });
  }

  onSlideImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.imageDisplayName.set(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const currentValue = this.slideForm().value();
      this.model.set({
        courseId: currentValue.courseId as string,
        slideTypeId: currentValue.slideTypeId as string,
        title: currentValue.title as string,
        content: dataUrl,
        ordering: Number(currentValue.ordering),
        active: Boolean(currentValue.active),
      });
    };
    reader.readAsDataURL(file);
  }

  execFormat(command: 'bold' | 'italic' | 'strikeThrough'): void {
    document.execCommand(command, false);
    this.richEditor?.nativeElement.focus();
    this.syncEditorToModel();
  }

  insertLineBreak(): void {
    const editor = this.richEditor?.nativeElement;
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const br = document.createElement('br');
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    sel.removeAllRanges();
    sel.addRange(range);
    this.syncEditorToModel();
  }

  onEditorInput(): void {
    this.syncEditorToModel();
  }

  private syncEditorToModel(): void {
    const rawHtml = this.richEditor?.nativeElement?.innerHTML ?? '';
    const html = /^(<br\s*\/?>\s*)+$/.test(rawHtml) ? '' : rawHtml;
    const currentValue = this.slideForm().value();
    this.model.set({
      courseId: currentValue.courseId as string,
      slideTypeId: currentValue.slideTypeId as string,
      title: currentValue.title as string,
      content: html,
      ordering: Number(currentValue.ordering),
      active: Boolean(currentValue.active),
    });
  }

  private refreshEditor(content: string): void {
    setTimeout(() => {
      if (this.richEditor?.nativeElement) {
        this.richEditor.nativeElement.innerHTML = content;
      }
    });
  }
}
