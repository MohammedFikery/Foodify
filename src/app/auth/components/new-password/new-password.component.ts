import { Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-password',
  standalone: false,
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly Router = inject(Router);
  hide = signal(true);

  createAccountForm: FormGroup = new FormGroup(
    {
      password: new FormControl(null, [Validators.required]),
      password_confirmation: new FormControl(null),
    },
    this.confirmPassword
  );

  createNewAccount(createAccountForm: FormGroup) {
    if (this.createAccountForm.invalid) {
      this.createAccountForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('otp', this._AuthService.otp());
    formData.append('phone', this._AuthService.phoneNumber());
    formData.append('password', createAccountForm.value.password);
    formData.append(
      'password_confirmation',
      createAccountForm.value.password_confirmation
    );
    this._AuthService.resetPassword(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.Router.navigate(['/auth/login']);
      },
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  confirmPassword(g: AbstractControl) {
    if (g.get('password')?.value === g.get('password_confirmation')?.value) {
      return null;
    }
    return {
      misMatch: true,
    };
  }
}
