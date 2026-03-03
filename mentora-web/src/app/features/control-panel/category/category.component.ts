import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { CategoryResponse } from 'app/services/responses/category.response';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<CategoryResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = 1, pageSize: number = 10): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.getAll(page, pageSize).subscribe({
      next: (res) => {
        this.categories.set(res.data.items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar categorias.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  trackById(_: number, category: CategoryResponse): string {
    return category.id;
  }
}
