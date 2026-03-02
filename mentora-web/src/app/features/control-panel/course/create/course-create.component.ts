import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent {
  form = {
    nome: '',
    categoria: '',
    cargaHoraria: '',
    ativo: true,
    mostrarCertificado: true
  };

  private readonly router = inject(Router);

  close(): void {
    this.router.navigate(['/control-panel/course']);
  }

  submit(courseForm: NgForm): void {
    if (courseForm.invalid) {
      courseForm.form.markAllAsTouched();
      return;
    }
    // Future: connect to service to persist the course
    this.close();
  }
}
