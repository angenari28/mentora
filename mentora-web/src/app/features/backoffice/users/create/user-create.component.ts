import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength, minLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { WorkspaceService } from 'app/services/workspace.service';
import { Workspace } from 'app/services/responses/workspace.response';

interface IUserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  workspaceId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly passwordMismatch = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly workspaces = signal<Workspace[]>([]);
  readonly loadingWorkspaces = signal(false);

  private readonly model = signal<IUserForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    workspaceId: '',
    isActive: true,
  });

  ngOnInit(): void {
    this.loadingWorkspaces.set(true);
    this.workspaceService.getAll(1, 100).subscribe({
      next: (res) => {
        this.workspaces.set(res.data.items);
        this.loadingWorkspaces.set(false);
      },
      error: () => this.loadingWorkspaces.set(false),
    });
  }

  protected readonly userForm = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.name, { message: 'O campo Nome é obrigatório.' });
      maxLength(schemaPath.name, 100);
      required(schemaPath.email, { message: 'O campo E-mail é obrigatório.' });
      maxLength(schemaPath.email, 255);
      required(schemaPath.password, { message: 'O campo Senha é obrigatório.' });
      minLength(schemaPath.password, 6, { message: 'A senha deve ter no mínimo 6 caracteres.' });
      required(schemaPath.confirmPassword, { message: 'A confirmação de senha é obrigatória.' });
      required(schemaPath.role, { message: 'O campo Função é obrigatório.' });
      required(schemaPath.workspaceId, { message: 'O campo Workspace é obrigatório.' });
    },
    {
      submission: {
        action: async (form) => {
          this.submitError.set(null);
          this.passwordMismatch.set(false);

          const values = form().value();
          if (values.password !== values.confirmPassword) {
            this.passwordMismatch.set(true);
            return Promise.reject('Senhas não coincidem');
          }

          this.submitting.set(true);

          return new Promise<void>((resolve, reject) => {
            this.userService.create({
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
              isActive: values.isActive,
              workspaceId: values.workspaceId,
            }).subscribe({
              next: () => {
                this.submitting.set(false);
                this.router.navigate(['/backoffice/users']);
                resolve();
              },
              error: (err) => {
                this.submitting.set(false);
                this.submitError.set('Erro ao criar usuário. Tente novamente.');
                console.error(err);
                reject(err);
              },
            });
          });
        },
        onInvalid: () => {
          console.warn('Formulário inválido.');
        },
      },
    },
  );

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  close(): void {
    this.router.navigate(['/backoffice/users']);
  }
}
