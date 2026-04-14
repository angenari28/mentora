import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from 'app/services/workspace.service';
import { workspaceModel } from '../shared/workspace.model';
import { editValidate } from '../shared/workspace.validation';

@Component({
  selector: 'app-workspace-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/workspace-shared.component.html',
  styleUrls: ['../shared/workspace-shared.component.css'],
})
export class WorkspaceEditComponent implements OnInit {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly modalTitle = signal('Editar Workspace');
  readonly submitLabel = signal('Salvar Alterações');
  readonly submittingLabel = signal('Salvando...');
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly loading = signal(true);

  private workspaceId = '';
  private readonly model = workspaceModel;

  protected readonly workspaceForm = form(this.model, editValidate, {
    submission: {
      action: async (f) => {
        this.submitError.set(null);
        this.submitting.set(true);

        const values = f().value();
        return new Promise<void>((resolve, reject) => {
          this.workspaceService
            .update(this.workspaceId, {
              name: values.name,
              logo: values.logo,
              primaryColor: values.primaryColor,
              secondaryColor: values.secondaryColor,
              bigBanner: values.bigBanner,
              smallBanner: values.smallBanner,
              active: values.active,
              url: values.url,
            })
            .subscribe({
              next: () => {
                this.submitting.set(false);
                this.router.navigate(['/backoffice/workspaces']);
                resolve();
              },
              error: (err) => {
                this.submitting.set(false);
                this.submitError.set('Erro ao atualizar workspace. Tente novamente.');
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
    this.workspaceId = this.route.snapshot.paramMap.get('id') ?? '';

    this.workspaceService.getById(this.workspaceId).subscribe({
      next: (res) => {
        const ws = res.data;
        this.model.set({
          name: ws.name,
          logo: ws.logo ?? '',
          primaryColor: ws.primaryColor ?? '#1C2340',
          secondaryColor: ws.secondaryColor ?? '#4A6CF7',
          bigBanner: ws.bigBanner ?? '',
          smallBanner: ws.smallBanner ?? '',
          active: ws.active,
          url: ws.url,
        });
        this.loading.set(false);
      },
      error: () => {
        this.router.navigate(['/backoffice/workspaces']);
      },
    });
  }

  close(): void {
    this.router.navigate(['/backoffice/workspaces']);
  }
}
