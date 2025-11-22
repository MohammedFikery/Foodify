import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _AuthService = inject(AuthService);
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
        console.log(res);
      },
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
