import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { EnterOtpComponent } from './components/enter-otp/enter-otp.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    NewPasswordComponent,
    ForgetPasswordComponent,
    EnterOtpComponent,
    CreateAccountComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, FormsModule],
})
export class AuthModule {}
