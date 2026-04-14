import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ClassService } from 'app/services/class.service';
import { CourseService } from 'app/services/course.service';
import { CourseResponse } from 'app/services/responses/course.response';
import { Workspace } from 'app/services/responses/workspace.response';
import { classModel, IFormReadonly } from '../shared/class.model';
import { validate } from '../shared/class.validation';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-class-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/class-shared.component.html',
  styleUrls: ['../shared/class-shared.component.css'],
})
export class ClassCreateComponent implements OnInit, IFormReadonly {
  readonly = signal(false);

  private readonly classService = inject(ClassService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly workspaceService = inject(WorkspaceService);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly courses = signal<CourseResponse[]>([]);
  readonly loadingCourses = signal(false);
  readonly modalTitle = signal('Nova Turma');
  readonly submitLabel = signal('Criar');

  private readonly model = classModel;

  protected readonly classForm = form(
    this.model,
    validate,
    {
      submission: {
        action: async (form) => {
          this.submitError.set(null);
          this.submitting.set(true);

          const workspace = JSON.parse(
            localStorage.getItem('current_workspace') ?? 'null'
          ) as Workspace | null;
          const workspaceId = workspace?.id ?? '';
          const value = form().value();

          return new Promise<void>((resolve, reject) => {
            this.classService
              .create({
                workspaceId,
                courseId: value.courseId,
                name: value.name,
                dateStart: new Date(value.dateStart).toISOString(),
                dateEnd: new Date(value.dateEnd).toISOString(),
                active: value.active,
              })
              .subscribe({
                next: () => {
                  this.submitting.set(false);
                  this.router.navigate(['/control-panel/class']);
                  resolve();
                },
                error: (err) => {
                  this.submitting.set(false);
                  this.submitError.set('Erro ao criar turma. Tente novamente.');
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
    }
  );

  ngOnInit(): void {
    this.model.set({ courseId: '', name: '', dateStart: '', dateEnd: '', active: true });
    this.loadCourses();
  }

  loadCourses(): void {
    this.loadingCourses.set(true);
    this.courseService.getAll(1, 200, undefined, undefined, this.workspaceService.getCurrentWorkspaceId() ?? undefined).subscribe({
      next: (res) => {
        this.courses.set(res.data.items);
        this.loadingCourses.set(false);
      },
      error: () => {
        this.loadingCourses.set(false);
      },
    });
  }

  close(): void {
    this.router.navigate(['/control-panel/class']);
  }
}
