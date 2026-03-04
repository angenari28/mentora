import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ClassService } from 'app/services/class.service';
import { CourseService } from 'app/services/course.service';
import { CourseResponse } from 'app/services/responses/course.response';
import { Workspace } from 'app/services/responses/workspace.response';

interface IClass {
  courseId: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  active: boolean;
}

@Component({
  selector: 'app-class-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: './class-create.component.html',
  styleUrls: ['./class-create.component.css'],
})
export class ClassCreateComponent implements OnInit {
  private readonly classService = inject(ClassService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly courses = signal<CourseResponse[]>([]);
  readonly loadingCourses = signal(false);

  private readonly model = signal<IClass>({
    courseId: '',
    name: '',
    dateStart: '',
    dateEnd: '',
    active: true,
  });

  protected readonly classForm = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.courseId, { message: 'Selecione um curso.' });
      required(schemaPath.name, { message: 'O campo Nome é obrigatório.' });
      maxLength(schemaPath.name, 100);
      required(schemaPath.dateStart, { message: 'A data de início é obrigatória.' });
      required(schemaPath.dateEnd, { message: 'A data de término é obrigatória.' });
    },
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
    this.loadCourses();
  }

  loadCourses(): void {
    this.loadingCourses.set(true);
    this.courseService.getAll(1, 200).subscribe({
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
