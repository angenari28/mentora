import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { LoginAllowedRoles } from '@services/requests/login.request';
import { LoginResponse } from '@services/responses/login.response';

@Component({
  selector: 'app-login-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-aluno.component.html',
  styleUrl: './login-aluno.component.css'
})
export class LoginAlunoComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Login Aluno');
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
      .login({ email: this.email.trim(), password: this.password, role: LoginAllowedRoles.Student })
      .subscribe({
        next: (response: LoginResponse) => {
          if (response.success) {
            this.successMessage = response.message;
            this.router.navigate(['/aluno']);
          } else {
            this.errorMessage = response.message || 'Falha ao autenticar.';
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao conectar com o servidor.';
          this.loading = false;
        }
      });
  }
}
