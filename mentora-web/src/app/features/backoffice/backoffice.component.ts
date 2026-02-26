import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

@Component({
  selector: 'app-backoffice',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterModule],
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BackofficeComponent implements OnInit {
  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('Backoffice');
  }
}
