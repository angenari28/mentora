import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { DetailsScreenComponent } from './details-screen/details-screen.component';

@Component({
  selector: 'app-backoffice',
  standalone: true,
  imports: [SidebarComponent, DashboardComponent, UsersComponent, NavbarComponent, DetailsScreenComponent],
  templateUrl: './backoffice.component.html',
  styleUrl: './backoffice.component.css',
  encapsulation: ViewEncapsulation.None
})
export class BackofficeComponent implements OnInit, OnDestroy {
  private onDocumentClick = (event: MouseEvent) => {
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const target = event.target as HTMLElement | null;
    const userProfile = target?.closest('.user-profile');

    if (!userProfile && userMenuDropdown?.classList.contains('active')) {
      userMenuDropdown.classList.remove('active');
    }
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const win = window as unknown as Record<string, any>;

    win["switchTab"] = (event: Event, tabId: string) => {
      const target = event.target as HTMLElement;
      const tabContainer = target.closest('.card-body');
      if (!tabContainer) return;

      tabContainer.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.remove('active');
      });
      target.classList.add('active');

      tabContainer.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.remove('active');
      });
      document.getElementById(tabId)?.classList.add('active');
    };

    win["openModal"] = () => {
      document.getElementById('demo-modal')?.classList.add('active');
    };

    document.addEventListener('click', this.onDocumentClick);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick);
  }
}
