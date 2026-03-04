import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ClassService } from 'app/services/class.service';
import { ClassResponse } from 'app/services/responses/class.response';
import { ListItem } from '@services/responses/shared/list-item.response';
import { TableComponent } from '@components/table/table.component';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, TableComponent],
  templateUrl: './class.component.html',
  styleUrl: './class.component.css'
})
export class ClassComponent implements OnInit {
  private readonly classService = inject(ClassService);

  readonly pagedClasses = signal<ListItem<ClassResponse>>({
    items: [],
    meta: { totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPrevious: false, hasNext: false }
  });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = 10;
  readonly deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.classService.getAll(this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        this.pagedClasses.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar turmas.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  deleteClass(id: string): void {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) return;
    this.deletingId.set(id);

    this.classService.delete(id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.loadClasses();
      },
      error: (err) => {
        this.deletingId.set(null);
        console.error(err);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagedClasses().meta.totalPages) return;
    this.currentPage.set(page);
    this.loadClasses();
  }

  trackById(_: number, item: ClassResponse): string {
    return item.id;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
