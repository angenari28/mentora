import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CategoryService } from 'app/services/category.service';
import { CategoryResponse } from 'app/services/responses/category.response';
import { ListItem } from '@services/responses/shared/list-item.response';
import { TableComponent } from '@components/table/table.component';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, TableComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly workspaceService = inject(WorkspaceService);

  readonly pagedCategories = signal<ListItem<CategoryResponse>>({
    items: [],
    meta: { totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPrevious: false, hasNext: false }
  });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.getAll(this.currentPage(), this.pageSize, undefined, undefined, this.workspaceService.getCurrentWorkspaceId() ?? undefined).subscribe({
      next: (res) => {
        this.pagedCategories.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar categorias.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagedCategories().meta.totalPages) return;
    this.currentPage.set(page);
    this.loadCategories();
  }

  trackById(_: number, category: CategoryResponse): string {
    return category.id;
  }
}
