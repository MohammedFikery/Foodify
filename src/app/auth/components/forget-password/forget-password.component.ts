import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  ForgetPassword: FormGroup = new FormGroup({
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
    ]),
  });

  ForgetPass(ForgetPassword: FormGroup) {
    if (this.ForgetPassword.invalid) {
      this.ForgetPassword.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('phone', ForgetPassword.value.phone);
    this._AuthService.forgotPassword(formData).subscribe({
      next: (res) => {
        console.log(res.message);
        this._ToastrService.success(res.message, ' successfully');
        this._AuthService.phoneNumber.set(ForgetPassword.value.phone);
        this._AuthService.otp.set('1234');
        this.Router.navigate(['/auth/otp', '1']);
      },
    });
  }
}
