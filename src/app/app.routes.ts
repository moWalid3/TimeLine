import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/timelines/timeline/timeline.component').then(c => c.TimelineComponent)},
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(c => c.LoginComponent)},
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(c => c.RegisterComponent)},
  { path: '**', loadComponent: () => import('./pages/shared/notfound/notfound.component').then(c => c.NotfoundComponent)},
];
