import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../services/responses/user.response';
import { ListItem } from '@services/responses/shared/list-item.response';
import { UserInitialsPipe } from 'app/pipes/user-initials.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, UserInitialsPipe],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  users = signal<ListItem<User>>({ items: [], meta: { totalCount: 0, pageNumber: 0, pageSize: 0, totalPages: 0, hasPrevious: false, hasNext: false } });
  loading = signal(false);
  error = signal('');

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set('');

    this.userService.getAll().subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar usuários');
        this.loading.set(false);
        console.error('Erro ao buscar usuários:', err);
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/backoffice/usuarios/create']);
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

  get pageNumbers(): number[] {
    const total = this.users().meta.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    console.log('Navegar para página:', page);
    // TODO: Implementar navegação de página com paginationParams
  }
}
