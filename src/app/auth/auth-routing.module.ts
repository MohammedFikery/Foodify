import { NgModule } from '@angular/core';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { EnterOtpComponent } from './components/enter-otp/enter-otp.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'Login' },
      {
        path: 'createAccount',
        component: CreateAccountComponent,
        title: 'createAccount',
      },
      {
        path: 'ForgetPassword',
        component: ForgetPasswordComponent,
        title: 'ForgetPassword',
      },
      {
        path: 'otp',
        component: EnterOtpComponent,
        title: 'EnterOtp',
      },
      {
        path: 'forgetpassword',
        component: ForgetPasswordComponent,
        title: 'forgetPassword',
      },
      {
        path: 'resetPassword',
        component: NewPasswordComponent,
        title: 'resetPassword',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
