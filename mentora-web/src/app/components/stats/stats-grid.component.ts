import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface StatItem {
  icon: string;
  trend: string;
  trendDirection: 'up' | 'down';
  label: string;
  value: string;
  footer: string;
}

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-grid.component.html',
  styleUrl: './stats-grid.component.css'
})
export class StatsGridComponent {
  @Input() stats: StatItem[] = [];
}
