import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { StudentService } from '@services/student.service';
import { User } from '@services/responses/user.response';
import { ListItem } from '@services/responses/shared/list-item.response';
import { TableComponent } from '@components/table/table.component';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, TableComponent],
  templateUrl: './student.list.component.html',
  styleUrls: ['./student.list.component.css'],
})
export class StudentListComponent {
  private readonly studentService = inject(StudentService);
  private readonly workspaceService = inject(WorkspaceService);

  students = signal<ListItem<User>>({
    items: [],
    meta: { totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0, hasPrevious: false, hasNext: false },
  });
  loading = signal(false);
  error = signal('');
  currentPage = signal(1);

  constructor() {
    this.loadStudents();
  }

  private loadStudents(page: number = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.studentService.getStudents({ pageNumber: page, workspaceId: this.workspaceService.getCurrentWorkspaceId() ?? undefined }).subscribe({
      next: (response) => {
        this.students.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar alunos');
        this.loading.set(false);
        console.error('Erro ao buscar alunos:', err);
      },
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadStudents(page);
  }
}
