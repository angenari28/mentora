import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-screen',
  standalone: true,
  imports: [],
  templateUrl: './details-screen.component.html',
  styleUrl: './details-screen.component.css'
})
export class DetailsScreenComponent {
  constructor(private router: Router) {}

  switchScreen(screen: string): void {
    const win = window as any;
    if (win.switchScreen) {
      win.switchScreen(screen);
    }
  }

  switchTab(event: Event, tabId: string): void {
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
  }

  toggleActive(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.toggle('active');
  }

  toggleCheckbox(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const checkbox = target.querySelector('.checkbox');
    checkbox?.classList.toggle('checked');
  }
}
