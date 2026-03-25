import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { LoginAllowedRoles } from '@services/requests/login.request';
import { LoginResponse } from '@services/responses/login.response';
import { CacheService, cacheToken } from '@services/cache.service';

@Component({
  selector: 'app-login-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-student.component.html',
  styleUrls: ['./login-student.component.css']
})
export class LoginStudentComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly cacheService = inject(CacheService);

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
            this.saveNameUserLocalStorage(response.user?.name || '');
            this.router.navigate([`/student/${response.user?.id}`]);
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

  saveNameUserLocalStorage(name: string): void {
    this.cacheService.addLocalStorage(cacheToken.student_name, name);
  }
}
