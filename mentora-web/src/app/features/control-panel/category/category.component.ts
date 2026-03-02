import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Category {
  nome: string;
  descricao: string;
  ativa: boolean;
  totalCursos: number;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categories: Category[] = [
    { nome: 'Mentoria', descricao: 'Conteúdos sobre processos de mentoria', ativa: true, totalCursos: 4 },
    { nome: 'Soft Skills', descricao: 'Habilidades interpessoais e comunicação', ativa: true, totalCursos: 6 },
    { nome: 'Gestão', descricao: 'Liderança, gestão de equipes e projetos', ativa: true, totalCursos: 3 },
    { nome: 'Produto', descricao: 'Product management e discovery', ativa: false, totalCursos: 2 },
  ];

  trackByNome(_: number, category: Category): string {
    return category.nome;
  }
}
