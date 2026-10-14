import { Routes } from '@angular/router';

import { Auth } from './auth/auth';
import { Home } from './home/home';
import { Dashboard } from './home/dashboard/dashboard';
import { Profile } from './home/profile/profile';
import { authGuard, guestGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: Auth,
    canActivate: [guestGuard]
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'profile',
        component: Profile
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];