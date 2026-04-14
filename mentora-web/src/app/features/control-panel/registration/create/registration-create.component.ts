import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ClassStudentService } from 'app/services/class-student.service';
import { ClassService } from 'app/services/class.service';
import { StudentService } from 'app/services/student.service';
import { ClassResponse } from 'app/services/responses/class.response';
import { User } from 'app/services/responses/user.response';
import { WorkspaceService } from '@services/workspace.service';

interface IRegistration {
  classId: string;
  userId: string;
  active: boolean;
}

@Component({
  selector: 'app-registration-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: './registration-create.component.html',
  styleUrls: ['./registration-create.component.css']
})
export class RegistrationCreateComponent implements OnInit {
  private readonly classStudentService = inject(ClassStudentService);
  private readonly classService = inject(ClassService);
  private readonly studentService = inject(StudentService);
  private readonly router = inject(Router);
  private readonly workspaceService = inject(WorkspaceService);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly classes = signal<ClassResponse[]>([]);
  readonly students = signal<User[]>([]);
  readonly loadingClasses = signal(false);
  readonly loadingStudents = signal(false);

  private readonly model = signal<IRegistration>({
    classId: '',
    userId: '',
    active: true
  });

  protected readonly registrationForm = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.classId, { message: 'Selecione uma turma.' });
      required(schemaPath.userId, { message: 'Selecione um aluno.' });
    },
    {
      submission: {
        action: async (form) => {
          this.submitError.set(null);
          this.submitting.set(true);

          const value = form().value();

          return new Promise<void>((resolve, reject) => {
            this.classStudentService
              .create({
                classId: value.classId,
                userId: value.userId,
                active: value.active
              })
              .subscribe({
                next: () => {
                  this.submitting.set(false);
                  this.router.navigate(['/control-panel/registration']);
                  resolve();
                },
                error: (err) => {
                  this.submitting.set(false);
                  this.submitError.set('Erro ao criar matrícula. Tente novamente.');
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

  ngOnInit(): void {
    this.loadClasses();
    this.loadStudents();
  }

  loadClasses(): void {
    this.loadingClasses.set(true);
    this.classService.getAll(1, 200, undefined, undefined, this.workspaceService.getCurrentWorkspaceId() ?? undefined).subscribe({
      next: (res) => {
        this.classes.set(res.data.items);
        this.loadingClasses.set(false);
      },
      error: () => {
        this.loadingClasses.set(false);
      }
    });
  }

  loadStudents(): void {
    this.loadingStudents.set(true);
    this.studentService.getStudents({ pageNumber: 1, pageSize: 200, workspaceId: this.workspaceService.getCurrentWorkspaceId() ?? undefined }).subscribe({
      next: (res) => {
        this.students.set(res.data.items);
        this.loadingStudents.set(false);
      },
      error: () => {
        this.loadingStudents.set(false);
      }
    });
  }

  close(): void {
    this.router.navigate(['/control-panel/registration']);
  }
}
