import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
    title: 'Entrar | RV Finance',
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
    title: 'Criar conta | RV Finance',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard | RV Finance',
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/accounts.component').then((m) => m.AccountsComponent),
        title: 'Contas | RV Finance',
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
        title: 'Categorias | RV Finance',
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component').then((m) => m.TransactionsComponent),
        title: 'Transações | RV Finance',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
