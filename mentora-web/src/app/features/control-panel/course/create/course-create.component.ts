import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { CategoryResponse } from 'app/services/responses/category.response';
import { CourseService } from 'app/services/course.service';
import { Workspace } from 'app/services/responses/workspace.response';
import { courseModel, IFormReadonly } from '../shared/course.model';
import { validate } from '../shared/course.validation';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/course-shared.component.html',
  styleUrls: ['../shared/course-shared.component.css'],
})
export class CourseCreateComponent implements OnInit, IFormReadonly {
  readonly = signal(false);
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly courseService = inject(CourseService);

  readonly categories = signal<CategoryResponse[]>([]);
  readonly loadingCategories = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly faceImagePreview = signal<string>('');
  readonly faceImageBase64 = signal<string>('');
  readonly modalTitle = signal('Novo Curso');
  readonly submitLabel = signal('Criar');
  private readonly model = courseModel;

  protected readonly courseForm = form(this.model, validate, {
    submission: {
      action: async (f) => {
        this.submitError.set(null);
        this.submitting.set(true);

        const workspace = JSON.parse(
          localStorage.getItem('current_workspace') ?? 'null',
        ) as Workspace | null;
        const workspaceId = workspace?.id ?? '';
        const value = f().value();

        return new Promise<void>((resolve, reject) => {
          this.courseService
            .create({
              name: value.name,
              categoryId: value.categoryId,
              workspaceId,
              workloadHours: value.workloadHours,
              active: value.active,
              showCertificate: value.showCertificate,
              faceImage: this.faceImageBase64(),
              certificateImage: '',
            })
            .subscribe({
              next: () => {
                this.submitting.set(false);
                this.router.navigate(['/control-panel/course']);
                resolve();
              },
              error: (err) => {
                this.submitting.set(false);
                this.submitError.set('Erro ao criar curso. Tente novamente.');
                console.error(err);
                reject(err);
              },
            });
        });
      },
      onInvalid: () => {
        console.warn('Formulário inválido.');
      },
    },
  });

  ngOnInit(): void {
    this.loadingCategories.set(true);
    this.categoryService.getAll(1, 100).subscribe({
      next: (res) => {
        if (res.success) this.categories.set(res.data.items);
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false),
    });
  }

  triggerImageInput(): void {
    this.imageInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 340;
        canvas.height = 180;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 340, 180);
        const resized = canvas.toDataURL('image/jpeg', 0.75);
        this.faceImagePreview.set(resized);
        this.faceImageBase64.set(resized);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  close(): void {
    this.router.navigate(['/control-panel/course']);
  }
}
