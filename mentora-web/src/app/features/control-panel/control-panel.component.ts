import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CacheService, cacheToken } from '@services/cache.service';

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
  private readonly cacheService = inject(CacheService);

  ngOnInit(): void {
    this.titleService.setTitle('Control Panel');
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('user_authenticated');
    this.cacheService.removeLocalStorage(cacheToken.user_role);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
