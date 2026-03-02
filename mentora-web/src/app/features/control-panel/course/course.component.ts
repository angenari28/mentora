import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Course {
  nome: string;
  categoria: string;
  ativo: boolean;
  mostrarCertificado: boolean;
  cargaHoraria: string;
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  courses: Course[] = [
    {
      nome: 'Fundamentos de Mentoria',
      categoria: 'Mentoria',
      ativo: true,
      mostrarCertificado: true,
      cargaHoraria: '20h'
    },
    {
      nome: 'Comunicação Estratégica',
      categoria: 'Soft Skills',
      ativo: true,
      mostrarCertificado: true,
      cargaHoraria: '12h'
    },
    {
      nome: 'Liderança Prática',
      categoria: 'Gestão',
      ativo: true,
      mostrarCertificado: false,
      cargaHoraria: '18h'
    },
    {
      nome: 'Product Discovery',
      categoria: 'Produto',
      ativo: false,
      mostrarCertificado: false,
      cargaHoraria: '16h'
    }
  ];

  trackByNome(_: number, course: Course): string {
    return course.nome;
  }
}
