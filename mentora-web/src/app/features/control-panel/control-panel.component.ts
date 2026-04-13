import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { CacheService, cacheToken } from '@services/cache.service';
import { UserInitialsPipe } from 'app/pipes/user-initials.pipe';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, UserInitialsPipe],
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);
  private readonly cacheService = inject(CacheService);
  protected readonly userRole = signal<string>(this.cacheService.getLocalStorage(cacheToken.user_role)?.toString() || 'User');
  protected readonly userName = signal<string>(this.cacheService.getLocalStorage(cacheToken.user_name)?.toString() || 'User');

  ngOnInit(): void {
    this.titleService.setTitle($localize`:@@control_panel_page_title:Painel de Controle`);
  }

  protected logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('user_authenticated');
    this.cacheService.removeLocalStorage(cacheToken.user_role);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
