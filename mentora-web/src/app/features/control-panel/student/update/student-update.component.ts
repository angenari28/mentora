import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'app/services/user.service';
import { Workspace } from 'app/services/responses/workspace.response';
import { studentModel, IFormReadonly, IStudentCourseReset } from '../shared/student.model';
import { validateUpdate } from '../shared/student.validation';
import { ClassStudentService } from 'app/services/class-student.service';
import { CourseSlideTimeService } from 'app/services/course-slide-time.service';

@Component({
  selector: 'app-student-update',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/student-shared.component.html',
  styleUrls: ['../shared/student-shared.component.css'],
})
export class StudentUpdateComponent implements OnInit, IFormReadonly, IStudentCourseReset {
  readonly = signal(false);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly classStudentService = inject(ClassStudentService);
  private readonly courseSlideTimeService = inject(CourseSlideTimeService);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly modalTitle = signal('Editar Aluno');
  readonly submitLabel = signal('Salvar');

  readonly showCourseReset = signal(true);
  readonly studentCourses = signal<{ id: string; name: string }[]>([]);
  readonly selectedCourseId = signal('');
  readonly resettingCourse = signal(false);

  private studentId = '';

  private readonly model = studentModel;

  protected readonly studentForm = form(
    this.model,
    validateUpdate,
    {
      submission: {
        action: async (f) => {
          this.submitError.set(null);
          this.submitting.set(true);

          const workspace = JSON.parse(
            localStorage.getItem('current_workspace') ?? 'null',
          ) as Workspace | null;
          const workspaceId = workspace?.id ?? '';
          const value = f().value();

          return new Promise<void>((resolve, reject) => {
            this.userService
              .update(this.studentId, {
                name: value.name,
                email: value.email,
                password: value.password,
                role: 'Student',
                isActive: value.isActive,
                workspaceId,
              })
              .subscribe({
                next: () => {
                  this.submitting.set(false);
                  this.router.navigate(['/control-panel/student']);
                  resolve();
                },
                error: (err) => {
                  this.submitting.set(false);
                  this.submitError.set('Erro ao atualizar aluno. Tente novamente.');
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

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';

    this.userService.getById(this.studentId).subscribe({
      next: (res) => {
        if (res.success) {
          const s = res.data;
          this.model.set({
            name: s.name,
            email: s.email,
            password: '',
            isActive: s.isActive,
          });
        }
      },
    });

    this.classStudentService.getByStudentId(this.studentId).subscribe({
      next: (res) => {
        if (res.success) {
          const seen = new Set<string>();
          const courses = res.data
            .filter((c) => c.course.active)
            .map((c) => ({ id: c.course.id, name: c.course.name }))
            .filter((c) => {
              if (seen.has(c.id)) return false;
              seen.add(c.id);
              return true;
            });
          this.studentCourses.set(courses);
        }
      },
    });
  }

  resetCourseSlideTime(): void {
    const courseId = this.selectedCourseId();
    if (!courseId || !this.studentId) return;
    this.resettingCourse.set(true);
    this.courseSlideTimeService.reset(this.studentId, courseId).subscribe({
      next: () => {
        this.resettingCourse.set(false);
        this.selectedCourseId.set('');
      },
      error: (err) => {
        this.resettingCourse.set(false);
        console.error('Erro ao reiniciar progresso:', err);
      },
    });
  }

  close(): void {
    this.router.navigate(['/control-panel/student']);
  }
}
