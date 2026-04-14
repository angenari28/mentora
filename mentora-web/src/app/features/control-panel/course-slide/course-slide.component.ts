import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CourseSlideService } from 'app/services/course-slide.service';
import { CourseService } from 'app/services/course.service';
import { CourseSlideResponse } from 'app/services/responses/course-slide.response';
import { CourseResponse } from 'app/services/responses/course.response';
import { TableComponent } from '@components/table/table.component';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-course-slide',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, TableComponent],
  templateUrl: './course-slide.component.html',
  styleUrl: './course-slide.component.css'
})
export class CourseSlideComponent implements OnInit {
  private readonly courseSlideService = inject(CourseSlideService);
  private readonly courseService = inject(CourseService);
  private readonly workspaceService = inject(WorkspaceService);

  courses = signal<CourseResponse[]>([]);
  selectedCourseId = signal<string>('');
  slides = signal<CourseSlideResponse[]>([]);
  loading = signal(false);
  loadingCourses = signal(false);
  error = signal<string | null>(null);
  savingOrder = signal(false);

  private dragIndex: number | null = null;
  private draggingRow: HTMLTableRowElement | null = null;

  ngOnInit(): void {
    this.loadingCourses.set(true);
    this.courseService.getAll(1, 100, undefined, undefined, this.workspaceService.getCurrentWorkspaceId() ?? undefined).subscribe({
      next: (res) => {
        if (res.success) this.courses.set(res.data.items);
        this.loadingCourses.set(false);
      },
      error: () => this.loadingCourses.set(false)
    });
  }

  onCourseChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCourseId.set(value);
    if (value) this.loadSlides(value);
    else this.slides.set([]);
  }

  loadSlides(courseId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.courseSlideService.getByCourse(courseId).subscribe({
      next: (res) => {
        if (res.success) this.slides.set(res.data);
        else this.error.set(res.message);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar slides.');
        this.loading.set(false);
      }
    });
  }

  deleteSlide(id: string): void {
    if (!confirm('Tem certeza que deseja remover este slide?')) return;
    this.courseSlideService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.slides.update(list => list.filter(s => s.id !== id));
        }
      },
      error: () => this.error.set('Erro ao remover slide.')
    });
  }

  onDragStart(event: DragEvent, index: number): void {
    this.dragIndex = index;
    const row = event.currentTarget as HTMLTableRowElement;
    const originalTable = row.closest('table');

    // Wrap the cloned <tr> in a proper <table><tbody> so it renders with correct width
    const ghostTable = document.createElement('table');
    ghostTable.style.cssText = `position:fixed;top:-9999px;left:0;border-collapse:collapse;background:#fff;width:${originalTable?.offsetWidth ?? row.offsetWidth}px;`;
    const tbody = document.createElement('tbody');
    const clone = row.cloneNode(true) as HTMLTableRowElement;
    tbody.appendChild(clone);
    ghostTable.appendChild(tbody);
    document.body.appendChild(ghostTable);

    event.dataTransfer?.setDragImage(ghostTable, event.offsetX, event.offsetY);

    // After the drag snapshot is taken, style the original row as a placeholder
    setTimeout(() => {
      document.body.removeChild(ghostTable);
      row.style.opacity = '0.3';
      row.style.outline = '2px dashed var(--color-primary, #6366f1)';
    }, 0);

    this.draggingRow = row;
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.dragIndex === null || this.dragIndex === index) return;

    const list = [...this.slides()];
    const [moved] = list.splice(this.dragIndex, 1);
    list.splice(index, 0, moved);
    this.dragIndex = index;
    this.slides.set(list);
  }

  onDragEnd(): void {
    if (this.draggingRow) {
      this.draggingRow.style.opacity = '';
      this.draggingRow.style.outline = '';
      this.draggingRow = null;
    }
    this.dragIndex = null;
    this.saveOrder();
  }

  private saveOrder(): void {
    this.savingOrder.set(true);
    const items = this.slides().map((s, i) => ({ id: s.id, ordering: i + 1 }));
    this.courseSlideService.reorder(items).subscribe({
      next: (res) => {
        if (res.success) {
          this.slides.update(list => list.map((s, i) => ({ ...s, ordering: i + 1 })));
        } else {
          this.error.set('Erro ao salvar a sequência.');
        }
        this.savingOrder.set(false);
      },
      error: () => {
        this.error.set('Erro ao salvar a sequência.');
        this.savingOrder.set(false);
      }
    });
  }

  trackById(_: number, slide: CourseSlideResponse): string {
    return slide.id;
  }
}
