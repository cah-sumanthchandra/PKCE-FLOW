import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthCodeCallbackComponent} from './auth-code-callback.component';
import {PKCEAuthGuard} from './guards/pkce-auth-guard.service';
import {ImplicitCallbackComponent} from './implicit-callback-component';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'authorization-code/callback',
    component: AuthCodeCallbackComponent,
  },
  {
    path: 'implicit/callback',
    component: ImplicitCallbackComponent,
  },
  {
    path: 'users',
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
    canActivate: [PKCEAuthGuard]
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    canActivate: [PKCEAuthGuard]
  },
  {
    path: 'mfa',
    loadChildren: () => import('./mfa/mfa.module').then(m => m.MfaModule),
    canActivate: [PKCEAuthGuard]
  },
  {
    path: 'utilities',
    loadChildren: () => import('./utilities/utilities.module').then(m => m.UtilitiesModule),
    canActivate: [PKCEAuthGuard]
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'users'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
