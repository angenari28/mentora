import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { WorkspaceService } from 'app/services/workspace.service';
import { workspaceModel } from '../shared/workspace.model';
import { createValidate } from '../shared/workspace.validation';

@Component({
  selector: 'app-workspace-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FormRoot, FormField],
  templateUrl: '../shared/workspace-shared.component.html',
  styleUrls: ['../shared/workspace-shared.component.css'],
})
export class WorkspaceCreateComponent implements OnInit {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly router = inject(Router);

  readonly modalTitle = signal('Novo Workspace');
  readonly submitLabel = signal('Criar');
  readonly submittingLabel = signal('Criando...');
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly loading = signal(false);

  private readonly model = workspaceModel;

  protected readonly workspaceForm = form(this.model, createValidate, {
    submission: {
      action: async (f) => {
        this.submitError.set(null);
        this.submitting.set(true);

        const values = f().value();
        return new Promise<void>((resolve, reject) => {
          this.workspaceService
            .create({
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
                this.submitError.set('Erro ao criar workspace. Tente novamente.');
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
    this.model.set({
      name: '',
      logo: '',
      primaryColor: '#1C2340',
      secondaryColor: '#4A6CF7',
      bigBanner: '',
      smallBanner: '',
      active: true,
      url: '',
    });
  }

  close(): void {
    this.router.navigate(['/backoffice/workspaces']);
  }
}
