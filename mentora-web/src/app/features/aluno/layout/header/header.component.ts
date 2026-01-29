import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  studentName = 'Maria Silva';
  notificationCount = 3;

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
    window.location.href = '/login-aluno';
  }

  protected getStudentInitials(): string {
    return this.studentName
      .split(' ')
      .map(namePart => namePart.charAt(0).toUpperCase())
      .join('');
  }
}
