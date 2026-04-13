import { Component, computed, inject, OnInit } from '@angular/core';

import { CacheService, cacheToken } from '@services/cache.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  protected studentName = computed(() => this.cacheService.getLocalStorage(cacheToken.user_name) || '');
  notificationCount = 3;

  private readonly cacheService = inject(CacheService);

  ngOnInit(): void {
    const win = window as unknown as Record<string, any>;

    win["toggleUserDropdown"] = () => {
      this.toggleUserDropdown();
    };

    win["logout"] = () => {
      this.logout();
    };
  }

  toggleUserDropdown(): void {
    const dropdown = document.getElementById('user-dropdown-menu');
    dropdown?.classList.toggle('active');
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

  protected getStudentInitials(): string {
    return (this.studentName() as string)
      .split(' ')
      .map(namePart => namePart.charAt(0).toUpperCase())
      .join('');
  }
}
