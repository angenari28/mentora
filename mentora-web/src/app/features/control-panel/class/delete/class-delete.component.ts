import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'app/services/class.service';
import { CourseService } from 'app/services/course.service';
import { CourseResponse } from 'app/services/responses/course.response';
import { classModel, IFormReadonly } from '../shared/class.model';
import { readonly } from '../shared/class.validation';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-class-delete',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/class-shared.component.html',
  styleUrls: ['../shared/class-shared.component.css'],
})
export class ClassDeleteComponent implements OnInit, IFormReadonly {
  readonly = signal(true);

  private readonly classService = inject(ClassService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceService = inject(WorkspaceService);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly courses = signal<CourseResponse[]>([]);
  readonly loadingCourses = signal(false);
  readonly modalTitle = signal('Excluir Turma');
  readonly submitLabel = signal('Excluir');

  private classId = '';

  private readonly model = classModel;

  protected readonly classForm = form(this.model, readonly, {
    submission: {
      action: async () => {
        this.submitError.set(null);
        this.submitting.set(true);

        return new Promise<void>((resolve, reject) => {
          this.classService.delete(this.classId).subscribe({
            next: () => {
              this.submitting.set(false);
              this.router.navigate(['/control-panel/class']);
              resolve();
            },
            error: (err) => {
              this.submitting.set(false);
              this.submitError.set('Erro ao excluir turma. Tente novamente.');
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
    this.classId = this.route.snapshot.paramMap.get('id') ?? '';

    this.courseService.getAll(1, 200, undefined, undefined, this.workspaceService.getCurrentWorkspaceId() ?? undefined).subscribe({
      next: (res) => {
        this.courses.set(res.data.items);
      },
    });

    this.classService.getById(this.classId).subscribe({
      next: (res) => {
        if (res.success) {
          const c = res.data;
          this.model.set({
            courseId: c.courseId,
            name: c.name,
            dateStart: c.dateStart.substring(0, 10),
            dateEnd: c.dateEnd.substring(0, 10),
            active: c.active,
          });
        }
      },
    });
  }

  close(): void {
    this.router.navigate(['/control-panel/class']);
  }
}
