import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backoffice',
  standalone: true,
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

    win["switchScreen"] = (screenId: string) => {
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
    };

    win["logout"] = (event?: Event) => {
      event?.preventDefault();
      localStorage.removeItem('user_authenticated');
      sessionStorage.clear();
      this.router.navigate(['/login-gestao']);
    };

    win["toggleUserMenu"] = (event?: Event) => {
      event?.stopPropagation();
      const userMenuDropdown = document.getElementById('userMenuDropdown');
      userMenuDropdown?.classList.toggle('active');
    };

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
