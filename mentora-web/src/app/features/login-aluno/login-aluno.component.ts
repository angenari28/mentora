import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-aluno.component.html',
  styleUrl: './login-aluno.component.css'
})
export class LoginAlunoComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha email e senha.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .login({ email: this.email.trim(), password: this.password })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message;
            this.router.navigate(['/aluno']);
          } else {
            this.errorMessage = response.message || 'Falha ao autenticar.';
          }
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Erro ao conectar com o servidor.';
          this.loading = false;
        }
      });
  }
}
