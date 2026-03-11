import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength, minLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { Workspace } from '@services/responses/workspace.response';

interface IStudent {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  private readonly model = signal<IStudent>({
    name: '',
    email: '',
    password: '',
    isActive: true
  });

  protected readonly studentForm = form(
    this.model,
    (s) => {
      required(s.name, { message: 'O campo Nome é obrigatório.' });
      maxLength(s.name, 100);
      required(s.email, { message: 'O campo E-mail é obrigatório.' });
      maxLength(s.email, 200);
      required(s.password, { message: 'O campo Senha é obrigatório.' });
      minLength(s.password, 6, { message: 'A senha deve ter no mínimo 6 caracteres.' });
    },
    {
      submission: {
        action: async (f) => {
          this.submitError.set(null);
          this.submitting.set(true);

          const workspace = JSON.parse(localStorage.getItem('current_workspace') ?? 'null') as Workspace | null;
          const workspaceId = workspace?.id ?? '';
          const value = f().value();

          return new Promise<void>((resolve, reject) => {
            this.userService.create({
              name: value.name,
              email: value.email,
              password: value.password,
              role: 'Student',
              isActive: value.isActive,
              workspaceId
            }).subscribe({
              next: () => {
                this.submitting.set(false);
                this.router.navigate(['/control-panel/student']);
                resolve();
              },
              error: (err) => {
                this.submitting.set(false);
                this.submitError.set('Erro ao criar aluno. Tente novamente.');
                console.error(err);
                reject(err);
              }
            });
          });
        },
        onInvalid: () => {
          console.warn('Formulário inválido.');
        }
      }
    }
  );

  close(): void {
    this.router.navigate(['/control-panel/student']);
  }
}
