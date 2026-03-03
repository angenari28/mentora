import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { pipe, timeout } from 'rxjs';

interface ICategory {
  name: string;
  description: string;
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
  private readonly model = signal<ICategory>({ name: '', description: '', active: false });
  protected readonly categoryForm = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.name, { message: 'O campo Nome é obrigatório.'});
      maxLength(schemaPath.name, 20);
      maxLength(schemaPath.description, 100);
    },
    {
      submission: {
        action: async (form) => {
              setTimeout(() => {
                console.log('Submitting category:', form().value());
              }, 5000);
        },
        onInvalid: (form) => {
          console.log('Form is invalid:');
        },
      },
    },
  );

  private readonly router = inject(Router);

  close(): void {
    this.router.navigate(['/control-panel/category']);
  }
}
