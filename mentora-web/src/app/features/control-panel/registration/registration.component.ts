import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ClassStudentService } from 'app/services/class-student.service';
import { ClassStudentResponse } from 'app/services/responses/class-student.response';
import { ListItem } from '@services/responses/shared/list-item.response';
import { TableComponent } from '@components/table/table.component';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, TableComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  private readonly classStudentService = inject(ClassStudentService);
  private readonly workspaceService = inject(WorkspaceService);

  readonly pagedRegistrations = signal<ListItem<ClassStudentResponse>>({
    items: [],
    meta: { totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPrevious: false, hasNext: false }
  });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = 10;
  readonly deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.loading.set(true);
    this.error.set(null);

    this.classStudentService.getAll(this.currentPage(), this.pageSize, undefined, undefined, this.workspaceService.getCurrentWorkspaceId() ?? undefined).subscribe({
      next: (res) => {
        this.pagedRegistrations.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar matrículas.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  deleteRegistration(id: string): void {
    if (!confirm('Tem certeza que deseja excluir esta matrícula?')) return;
    this.deletingId.set(id);

    this.classStudentService.delete(id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.loadRegistrations();
      },
      error: (err) => {
        this.deletingId.set(null);
        console.error(err);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagedRegistrations().meta.totalPages) return;
    this.currentPage.set(page);
    this.loadRegistrations();
  }

  trackById(_: number, item: ClassStudentResponse): string {
    return item.id;
  }
}
