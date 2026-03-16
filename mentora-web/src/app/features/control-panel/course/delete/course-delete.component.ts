import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField, disabled } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { CategoryResponse } from 'app/services/responses/category.response';
import { CourseService } from 'app/services/course.service';
import { courseModel, IFormReadonly } from '../shared/course.model';
import { readonly } from '../shared/course.validation';

@Component({
  selector: 'app-course-delete',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/course-shared.component.html',
  styleUrls: ['../shared/course-shared.component.css'],
})
export class CourseDeleteComponent implements OnInit, IFormReadonly {
  readonly = signal(true);
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly courseService = inject(CourseService);

  readonly categories = signal<CategoryResponse[]>([]);
  readonly loadingCategories = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly faceImagePreview = signal<string>('');
  readonly faceImageBase64 = signal<string>('');
  readonly modalTitle = signal('Excluir Curso');
  readonly submitLabel = signal('Excluir');

  private courseId = '';

  private readonly model = courseModel;

  protected readonly courseForm = form(this.model, readonly, {
    submission: {
      action: async () => {
        this.submitError.set(null);
        this.submitting.set(true);

        return new Promise<void>((resolve, reject) => {
          this.courseService.delete(this.courseId).subscribe({
            next: () => {
              this.submitting.set(false);
              this.router.navigate(['/control-panel/course']);
              resolve();
            },
            error: (err) => {
              this.submitting.set(false);
              this.submitError.set('Erro ao excluir curso. Tente novamente.');
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
    this.courseId = this.route.snapshot.paramMap.get('id') ?? '';

    this.loadingCategories.set(true);
    this.categoryService.getAll(1, 100).subscribe({
      next: (res) => {
        if (res.success) this.categories.set(res.data.items);
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false),
    });

    this.courseService.getById(this.courseId).subscribe({
      next: (res) => {
        if (res.success) {
          const c = res.data;
          this.model.set({
            name: c.name,
            categoryId: c.categoryId,
            workloadHours: c.workloadHours,
            active: c.active,
            showCertificate: c.showCertificate,
          });
          if (c.faceImage) {
            this.faceImagePreview.set(c.faceImage);
            this.faceImageBase64.set(c.faceImage);
          }
        }
      },
    });
  }

  triggerImageInput(): void {
    // Desabilitado no modo exclusão
  }

  onImageSelected(_event: Event): void {
    // Desabilitado no modo exclusão
  }

  close(): void {
    this.router.navigate(['/control-panel/course']);
  }
}
