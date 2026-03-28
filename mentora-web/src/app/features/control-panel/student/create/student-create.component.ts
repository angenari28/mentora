import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { Workspace } from '@services/responses/workspace.response';
import { studentModel, IFormReadonly, IStudentCourseReset } from '../shared/student.model';
import { validate } from '../shared/student.validation';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/student-shared.component.html',
  styleUrls: ['../shared/student-shared.component.css'],
})
export class StudentCreateComponent implements IFormReadonly, IStudentCourseReset {
  readonly = signal(false);

  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly modalTitle = signal('Novo Aluno');
  readonly submitLabel = signal('Criar');

  // IStudentCourseReset — sem aluno criado ainda, lista vazia
  readonly showCourseReset = signal(false);
  readonly studentCourses = signal<{ id: string; name: string }[]>([]);
  readonly selectedCourseId = signal('');
  readonly resettingCourse = signal(false);
  resetCourseSlideTime(): void { /* n/a no modo criação */ }

  private readonly model = studentModel;

  constructor() {
    this.model.set({ name: '', email: '', password: '', isActive: true });
  }

  protected readonly studentForm = form(
    this.model,
    validate,
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
