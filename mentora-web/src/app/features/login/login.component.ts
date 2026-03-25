import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { WorkspaceService } from '@services/workspace.service';
import { Workspace } from '@services/responses/workspace.response';
import { LoginAllowedRoles } from '@services/requests/login.request';
import { LoginResponse } from '@services/responses/login.response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  private readonly authService = inject(AuthService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('Login');
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
      .login({ email: this.email.trim(), password: this.password, role: LoginAllowedRoles.Management })
      .subscribe({
        next: (response: LoginResponse) => {
          if (response.success) {
            this.successMessage = response.message;
            const role = response.user?.role?.toLowerCase();
            if (role === 'master') {
              this.router.navigate(['/backoffice']);
            } else if (role === 'administrator') {
              this.addWorkspaceToLocalStorage(response.user!.workspace!);
              this.router.navigate(['/control-panel']);
            }
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

  addWorkspaceToLocalStorage(workspace: Workspace): void {
    this.workspaceService.addLocalStorage(workspace);
  }
}
