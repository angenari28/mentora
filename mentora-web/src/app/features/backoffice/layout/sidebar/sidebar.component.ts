import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  switchScreen(screenId: string): void {
    document.querySelectorAll('.screen').forEach((screen) => {
      screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(`${screenId}-screen`);
    targetScreen?.classList.add('active');

    document.querySelectorAll('.nav-item').forEach((item) => {
      item.classList.remove('active');
    });

    const eventTarget = (window as any).event?.target as HTMLElement | undefined;
    eventTarget?.classList.add('active');

    window.scrollTo(0, 0);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    userMenuDropdown?.classList.toggle('active');
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('user_authenticated');
    sessionStorage.clear();
    this.router.navigate(['/login-gestao']);
  }
}
