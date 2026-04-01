import { Routes } from '@angular/router';

import { ControlPanelDashboardComponent } from './dashboard/control-panel-dashboard.component';
import { ControlPanelComponent } from './control-panel.component';
import { CourseCreateComponent } from './course/create/course-create.component';
import { controlPanelGuard } from '../../guards/control-panel.guard';
import { CourseUpdateComponent } from './course/update/course-update.component';
import { CourseDeleteComponent } from './course/delete/course-delete.component';
import { CourseListComponent } from './course/list/course.list.component';
import { CategoryComponent } from './category/category.component';
import { CategoryCreateComponent } from './category/create/category-create.component';
import { ClassComponent } from './class/class.component';
import { ClassCreateComponent } from './class/create/class-create.component';
import { StudentListComponent } from './student/list/student.list.component';
import { StudentCreateComponent } from './student/create/student-create.component';
import { StudentUpdateComponent } from './student/update/student-update.component';
import { StudentDeleteComponent } from './student/delete/student-delete.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationCreateComponent } from './registration/create/registration-create.component';
import { CourseSlideComponent } from './course-slide/course-slide.component';
import { CourseSlideCreateComponent } from './course-slide/create/course-slide-create.component';

export const CONTROL_PANEL_ROUTES: Routes = [
  {
    path: 'control-panel',
    component: ControlPanelComponent,
    canActivate: [controlPanelGuard],
    children: [
      { path: '', pathMatch: 'full', component: ControlPanelDashboardComponent },
      { path: 'course/create', component: CourseCreateComponent },
      { path: 'course/:id/edit', component: CourseUpdateComponent },
      { path: 'course/:id/delete', component: CourseDeleteComponent },
      { path: 'course', pathMatch: 'full', component: CourseListComponent },
      { path: 'category/create', component: CategoryCreateComponent },
      { path: 'category', pathMatch: 'full', component: CategoryComponent },
      { path: 'class/create', component: ClassCreateComponent },
      { path: 'class', pathMatch: 'full', component: ClassComponent },
      { path: 'student/create', component: StudentCreateComponent },
      { path: 'student/:id/edit', component: StudentUpdateComponent },
      { path: 'student/:id/delete', component: StudentDeleteComponent },
      { path: 'student', pathMatch: 'full', component: StudentListComponent },
      { path: 'registration/create', component: RegistrationCreateComponent },
      { path: 'registration', pathMatch: 'full', component: RegistrationComponent },
      { path: 'course-slide/create', component: CourseSlideCreateComponent },
      { path: 'course-slide', pathMatch: 'full', component: CourseSlideComponent }
    ]
  }
];
