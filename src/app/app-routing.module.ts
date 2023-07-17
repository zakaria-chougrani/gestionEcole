import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {authGuard} from "./_shared/guard/auth.guard";

const routes: Routes = [
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./auth/auth.component').then(mod => mod.AuthComponent),
    children: [
      {
        path: '',
        redirectTo: '/classes',
        pathMatch: 'full'
      },
      {
        path: 'classes',
        loadComponent: () => import('./pages/classes/classes.component').then(m => m.ClassesComponent)
      },
      {
        path: 'levels',
        loadComponent: () => import('./pages/classe-levels/classe-levels.component').then(m => m.ClasseLevelsComponent)
      },
      {
        path: 'contacts',
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'programs',
        loadComponent: () => import('./pages/programs/programs.component').then(m => m.ProgramsComponent)
      },
      {
        path: 'programs/:id',
        loadComponent: () => import('./pages/students-program/students-program.component').then(m => m.StudentsProgramComponent)
      },
      {
        path: 'sessions/:id',
        loadComponent: () => import('./pages/session-program/session-program.component').then(m => m.SessionProgramComponent)
      }
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
