import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css'
})
export class ControlPanelComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.titleService.setTitle('Control Panel');
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('user_authenticated');
    sessionStorage.clear();
    this.router.navigate(['/login-gestao']);
  }
}
