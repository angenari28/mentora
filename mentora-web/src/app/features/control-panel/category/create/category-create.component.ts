import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent {
  form = {
    nome: '',
    descricao: '',
    ativa: true
  };

  private readonly router = inject(Router);

  close(): void {
    this.router.navigate(['/control-panel/category']);
  }

  submit(categoryForm: NgForm): void {
    if (categoryForm.invalid) {
      categoryForm.form.markAllAsTouched();
      return;
    }
    // Future: connect to service to persist the category
    this.close();
  }
}
