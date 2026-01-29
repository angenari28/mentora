import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    const win = window as unknown as Record<string, any>;

    win["toggleUserDropdown"] = () => {
      const menu = document.getElementById('user-dropdown-menu');
      menu?.classList.toggle('active');
    };

    win["logout"] = () => {
      // Implementar lógica de logout
      console.log('Logout clicked');
    };

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (event) => {
      const userSection = document.querySelector('.header-user');
      const menu = document.getElementById('user-dropdown-menu');

      if (menu && !userSection?.contains(event.target as Node)) {
        menu.classList.remove('active');
      }
    });
  }

  ngOnDestroy(): void {
    const win = window as unknown as Record<string, any>;
    delete win["toggleUserDropdown"];
    delete win["logout"];
  }
}
