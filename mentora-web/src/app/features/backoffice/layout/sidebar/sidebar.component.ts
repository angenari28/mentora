import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CacheService, cacheToken } from '@services/cache.service';
import { UserInitialsPipe } from 'app/pipes/user-initials.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, UserInitialsPipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public subtitle = input<string>('');
  private readonly router = inject(Router);
  private readonly cacheService = inject(CacheService);
  protected readonly userRole = signal<string>(this.cacheService.getLocalStorage(cacheToken.user_role)?.toString() || 'User');
  protected readonly userName = signal<string>(this.cacheService.getLocalStorage(cacheToken.user_name)?.toString() || 'User');

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    userMenuDropdown?.classList.toggle('active');
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('user_authenticated');
    this.cacheService.removeLocalStorage(cacheToken.user_role);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
