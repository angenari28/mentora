import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { Workspace } from 'app/services/responses/workspace.response';

interface ICategory {
  name: string;
  description?: string;
  active: boolean;
}

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css'],
})
export class CategoryCreateComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  private readonly model = signal<ICategory>({ name: '', active: true });
  protected readonly categoryForm = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.name, { message: 'O campo Nome é obrigatório.' });
      maxLength(schemaPath.name, 100);
    },
    {
      submission: {
        action: async (form) => {
          this.submitError.set(null);
          this.submitting.set(true);

          const workspace = JSON.parse(localStorage.getItem('current_workspace') ?? 'null') as Workspace | null;
          const workspaceId = workspace?.id ?? '';

          return new Promise<void>((resolve, reject) => {
            this.categoryService.create({ ...form().value(), workspaceId }).subscribe({
              next: () => {
                this.submitting.set(false);
                this.router.navigate(['/control-panel/category']);
                resolve();
              },
              error: (err) => {
                this.submitting.set(false);
                this.submitError.set('Erro ao criar categoria. Tente novamente.');
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
    },
  );

  close(): void {
    this.router.navigate(['/control-panel/category']);
  }
}
