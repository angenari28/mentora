import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { CategoryResponse } from 'app/services/responses/category.response';
import { CourseService } from 'app/services/course.service';
import { Workspace } from 'app/services/responses/workspace.response';

interface ICourse {
  name: string;
  categoryId: string;
  workloadHours: number;
  active: boolean;
  showCertificate: boolean;
}

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly courseService = inject(CourseService);

  readonly categories = signal<CategoryResponse[]>([]);
  readonly loadingCategories = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  private readonly model = signal<ICourse>({
    name: '',
    categoryId: '',
    workloadHours: 0,
    active: true,
    showCertificate: true
  });

  protected readonly courseForm = form(
    this.model,
    (s) => {
      required(s.name, { message: 'O campo Nome é obrigatório.' });
      maxLength(s.name, 100);
      required(s.categoryId, { message: 'O campo Categoria é obrigatório.' });
      required(s.workloadHours, { message: 'O campo Duração é obrigatório.' });
    },
    {
      submission: {
        action: async (f) => {
          this.submitError.set(null);
          this.submitting.set(true);

          const workspace = JSON.parse(localStorage.getItem('current_workspace') ?? 'null') as Workspace | null;
          const workspaceId = workspace?.id ?? '';
          const value = f().value();

          return new Promise<void>((resolve, reject) => {
            this.courseService.create({
              name: value.name,
              categoryId: value.categoryId,
              workspaceId,
              workloadHours: value.workloadHours,
              active: value.active,
              showCertificate: value.showCertificate,
              faceImage: '',
              certificateImage: ''
            }).subscribe({
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
              }
            });
          });
        },
        onInvalid: () => {
          console.warn('Formulário inválido.');
        },
      },
    },
  );

  ngOnInit(): void {
    this.loadingCategories.set(true);
    this.categoryService.getAll(1, 100).subscribe({
      next: (res) => {
        if (res.success) this.categories.set(res.data.items);
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false)
    });
  }

  close(): void {
    this.router.navigate(['/control-panel/course']);
  }
}
