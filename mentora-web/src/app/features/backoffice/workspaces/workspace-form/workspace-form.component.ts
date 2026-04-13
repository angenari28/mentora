import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '@services/workspace.service';
import { Workspace } from '@services/responses/workspace.response';
import { WorkspaceRequest } from '@services/requests/workspace.request';

@Component({
  selector: 'app-workspace-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workspace-form.component.html',
  styleUrls: ['./workspace-form.component.css'],
})
export class WorkspaceFormComponent implements OnChanges {
  @Input() workspace: Workspace | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly workspaceService = new WorkspaceService();

  submitting = signal(false);
  submitError = signal<string | null>(null);

  form: WorkspaceRequest = this.emptyForm();

  get isEditing(): boolean {
    return !!this.workspace;
  }

  ngOnChanges(): void {
    if (this.workspace) {
      this.form = {
        name: this.workspace.name,
        logo: this.workspace.logo,
        primaryColor: this.workspace.primaryColor,
        secondaryColor: this.workspace.secondaryColor,
        bigBanner: this.workspace.bigBanner,
        smallBanner: this.workspace.smallBanner,
        active: this.workspace.active,
        url: this.workspace.url,
      };
    } else {
      this.form = this.emptyForm();
    }
    this.submitError.set(null);
  }

  submit(): void {
    if (!this.form.name.trim() || !this.form.url.trim()) {
      this.submitError.set('Nome e URL são obrigatórios.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const request$ = this.isEditing
      ? this.workspaceService.update(this.workspace!.id, this.form)
      : this.workspaceService.create(this.form);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.saved.emit();
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set(
          this.isEditing ? 'Erro ao atualizar workspace.' : 'Erro ao criar workspace.'
        );
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  private emptyForm(): WorkspaceRequest {
    return {
      name: '',
      logo: '',
      primaryColor: '#1C2340',
      secondaryColor: '#4A6CF7',
      bigBanner: '',
      smallBanner: '',
      active: true,
      url: '',
    };
  }
}
