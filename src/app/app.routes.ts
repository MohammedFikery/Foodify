import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'layout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/components/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/components/home/home.component').then(
            (c) => c.HomeComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/components/categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
      },
      {
        path: 'favorite',
        loadComponent: () =>
          import('./features/components/favorite/favorite.component').then(
            (c) => c.FavoriteComponent
          ),
      },
      {
        path: 'dashes/:id',
        loadComponent: () =>
          import('./features/components/dashes/dashes.component').then(
            (c) => c.DashesComponent
          ),
      },
    ],
  },
];
