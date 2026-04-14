import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { WorkspaceService } from '@services/workspace.service';
import { Workspace } from '@services/responses/workspace.response';
import { ListItem } from '@services/responses/shared/list-item.response';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css']
})
export class WorkspacesComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly router = inject(Router);

  workspaces = signal<ListItem<Workspace>>({ items: [], meta: {totalCount: 0, pageNumber: 0, pageSize: 0, totalPages: 0, hasPrevious: false, hasNext: false }});
  loading = signal(false);
  error = signal('');
  currentPage = signal(1);

  showDeleteModal = signal(false);
  deletingWorkspace = signal<Workspace | null>(null);
  deleting = signal(false);
  deleteError = signal('');

  constructor() {
    this.loadWorkspaces();
  }

  private loadWorkspaces(): void {
    this.loading.set(true);
    this.error.set('');

    this.workspaceService.getAll(this.currentPage()).subscribe({
      next: (response) => {
        this.workspaces.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar workspaces');
        this.loading.set(false);
        console.error('Erro ao buscar workspaces:', err);
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/backoffice/workspaces/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/backoffice/workspaces/edit', id]);
  }

  openDeleteModal(workspace: Workspace): void {
    this.deletingWorkspace.set(workspace);
    this.deleteError.set('');
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingWorkspace.set(null);
    this.deleteError.set('');
  }

  confirmDelete(): void {
    const workspace = this.deletingWorkspace();
    if (!workspace) return;

    this.deleting.set(true);
    this.deleteError.set('');

    this.workspaceService.delete(workspace.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.loadWorkspaces();
      },
      error: () => {
        this.deleting.set(false);
        this.deleteError.set('Erro ao excluir workspace. Tente novamente.');
      }
    });
  }

  get pageNumbers(): number[] {
    const total = this.workspaces().meta.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadWorkspaces();
  }

  switchScreen(screenId: string): void {
    document.querySelectorAll('.screen').forEach((screen) => {
      screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(`${screenId}-screen`);
    targetScreen?.classList.add('active');

    document.querySelectorAll('.nav-item').forEach((item) => {
      item.classList.remove('active');
    });

    window.scrollTo(0, 0);
  }
}
