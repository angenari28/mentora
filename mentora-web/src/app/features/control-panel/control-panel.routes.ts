import { Routes } from '@angular/router';
import { ControlPanelDashboardComponent } from './dashboard/control-panel-dashboard.component';
import { ControlPanelComponent } from './control-panel.component';
import { CourseCreateComponent } from './course/create/course-create.component';
import { CourseComponent } from './course/course.component';
import { CategoryComponent } from './category/category.component';
import { CategoryCreateComponent } from './category/create/category-create.component';
import { ClassComponent } from './class/class.component';
import { ClassCreateComponent } from './class/create/class-create.component';

export const CONTROL_PANEL_ROUTES: Routes = [
  {
    path: 'control-panel',
    component: ControlPanelComponent,
    children: [
      { path: '', pathMatch: 'full', component: ControlPanelDashboardComponent },
      { path: 'course/create', component: CourseCreateComponent },
      { path: 'course', pathMatch: 'full', component: CourseComponent },
      { path: 'category/create', component: CategoryCreateComponent },
      { path: 'category', pathMatch: 'full', component: CategoryComponent },
      { path: 'class/create', component: ClassCreateComponent },
      { path: 'class', pathMatch: 'full', component: ClassComponent }
    ]
  }
];
