import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';

import { forkJoin } from 'rxjs';
import { UserService } from 'app/services/user.service';
import { WorkspaceService } from 'app/services/workspace.service';
import { Workspace } from 'app/services/responses/workspace.response';
import { userModel } from '../shared/user.model';
import { editValidate } from '../shared/user.validation';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/user-shared.component.html',
  styleUrls: ['../shared/user-shared.component.css'],
})
export class UserEditComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isEditMode = signal(true);
  readonly modalTitle = signal('Editar Usuário');
  readonly submitLabel = signal('Salvar Alterações');
  readonly submittingLabel = signal('Salvando...');
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly passwordMismatch = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly workspaces = signal<Workspace[]>([]);
  readonly loadingWorkspaces = signal(false);
  readonly loading = signal(true);

  private userId = '';
  private readonly model = userModel;

  protected readonly userForm = form(this.model, editValidate, {
    submission: {
      action: async (f) => {
        this.submitError.set(null);
        this.submitting.set(true);

        const values = f().value();
        return new Promise<void>((resolve, reject) => {
          this.userService
            .update(this.userId, {
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
              isActive: values.isActive,
              workspaceId: values.workspaceId,
            })
            .subscribe({
              next: () => {
                this.submitting.set(false);
                this.router.navigate(['/backoffice/users']);
                resolve();
              },
              error: (err) => {
                this.submitting.set(false);
                this.submitError.set('Erro ao atualizar usuário. Tente novamente.');
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
  });

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';

    forkJoin({
      workspaces: this.workspaceService.getAll(1, 100),
      user: this.userService.getById(this.userId),
    }).subscribe({
      next: ({ workspaces, user }) => {
        this.workspaces.set(workspaces.data.items);
        const u = user.data;
        this.model.set({
          name: u.name,
          email: u.email,
          password: '',
          confirmPassword: '',
          role: u.role,
          workspaceId: u.workspace?.id ?? '',
          isActive: u.isActive,
        });
        this.loading.set(false);
      },
      error: () => {
        this.router.navigate(['/backoffice/users']);
      },
    });
  }

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

