import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);
  hide = signal(true);

  createAccountForm: FormGroup = new FormGroup(
    {
      full_name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
      ]),
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
    formData.append('full_name', createAccountForm.value.full_name);
    formData.append('phone', createAccountForm.value.phone);
    formData.append('password', createAccountForm.value.password);
    formData.append(
      'password_confirmation',
      createAccountForm.value.password_confirmation
    );
    this._AuthService.createNewAccount(formData).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'successfully');
        this._AuthService.phoneNumber.set(createAccountForm.value.phone);
        this.Router.navigate(['/auth/otp', '2']);
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
