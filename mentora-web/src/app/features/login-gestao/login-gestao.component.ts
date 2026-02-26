import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-gestao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-gestao.component.html',
  styleUrl: './login-gestao.component.css'
})
export class LoginGestaoComponent implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('Login Gestão');
  }

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
            const role = response.user?.role?.toLowerCase();
            if (role === 'master') {
              this.router.navigate(['/backoffice']);
            } else if (role === 'administrator') {
              this.router.navigate(['/painel-de-controle']);
            }
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
