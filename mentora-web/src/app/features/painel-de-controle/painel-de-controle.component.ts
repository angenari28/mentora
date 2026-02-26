import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-painel-de-controle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './painel-de-controle.component.html',
  styleUrl: './painel-de-controle.component.css'
})
export class PainelDeControleComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.titleService.setTitle('Painel de Controle');
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('user_authenticated');
    sessionStorage.clear();
    this.router.navigate(['/login-gestao']);
  }
}
