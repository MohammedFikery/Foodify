import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  hide = signal(true);
  loginForm: FormGroup = new FormGroup({
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
    ]),
    password: new FormControl(null, [Validators.required]),
  });

  login(loginForm: FormGroup) {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('phone', loginForm.value.phone);
    formData.append('password', loginForm.value.password);
    this._AuthService.Login(formData).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'successfully');
        localStorage.setItem('userToken', res.access_token);
        localStorage.setItem('token_type', res.token_type);
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('userFull_name', res.user.full_name);
        localStorage.setItem('userPhone', res.user.phone);
        this.Router.navigate(['/layout']);
      },
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
