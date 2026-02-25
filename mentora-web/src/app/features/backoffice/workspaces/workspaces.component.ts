import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../services/workspace.service';
import { Workspace } from '../../../services/responses/workspace.response';
import { ListItem } from '@services/responses/shared/list-item.response';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspaces.component.html',
  styleUrl: './workspaces.component.css'
})
export class WorkspacesComponent {
  private readonly workspaceService = inject(WorkspaceService);

  workspaces = signal<ListItem<Workspace>>({ items: [], totalCount: 0, pageNumber: 0, pageSize: 0, totalPages: 0, hasPrevious: false, hasNext: false });
  loading = signal(false);
  error = signal('');
  currentPage = signal(1);

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

  get pageNumbers(): number[] {
    const total = this.workspaces().totalPages;
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
