import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatItem, StatsGridComponent } from '@components/stats/stats-grid.component';

@Component({
  selector: 'app-painel-dashboard',
  standalone: true,
  imports: [CommonModule, StatsGridComponent],
  templateUrl: './painel-dashboard.component.html',
  styleUrls: ['./painel-dashboard.component.css']
})
export class PainelDashboardComponent {
  stats: StatItem[] = [
    {
      icon: '👥',
      trend: '↑ 12.5%',
      trendDirection: 'up',
      label: 'Usuários Ativos',
      value: '2,847',
      footer: '+324 novos usuários este mês'
    },
    {
      icon: '📖',
      trend: '↑ 8.2%',
      trendDirection: 'up',
      label: 'Cursos Ativos',
      value: '128',
      footer: '+12 cursos este mês'
    },
    {
      icon: '📚',
      trend: '↓ 3.1%',
      trendDirection: 'down',
      label: 'Turmas Ativas',
      value: '1,249',
      footer: '387 turmas ativas este mês'
    },
    {
      icon: '📗',
      trend: '↑ 15.3%',
      trendDirection: 'up',
      label: 'Cursos concluídos',
      value: '30%',
      footer: 'Acima da média mensal'
    }
  ];

  activities = [
    {
      icon: '👤',
      title: 'Novo usuário registrado',
      description: 'Maria Silva criou uma conta',
      time: 'há 5 minutos'
    }
  ];
}
