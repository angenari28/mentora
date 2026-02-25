import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../services/responses/user.response';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private readonly userService = inject(UserService);

  users = signal<User[]>([]);
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
