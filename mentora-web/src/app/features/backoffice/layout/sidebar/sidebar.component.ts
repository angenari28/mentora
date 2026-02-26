import { Component, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public subtitle = input<string>('');
  private readonly router = inject(Router);

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
