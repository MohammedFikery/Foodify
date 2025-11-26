import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterViewInit,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enter-otp',
  standalone: false,
  templateUrl: './enter-otp.component.html',
  styleUrl: './enter-otp.component.scss',
})
export class EnterOtpComponent implements OnInit {
  private readonly _AuthService = inject(AuthService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly Router = inject(Router);
  private readonly _ActivatedRoute = inject(ActivatedRoute);

  form = input<string>('');
  otp = ['', '', '', ''];
  verifyDisabled = signal(true);
  FormID = signal<string | null>('1');
  onOtpInput(event: any, index: number) {
    const value = event.target.value.replace(/\D/g, '').slice(0, 1);
    this.otp[index] = value;

    if (value && index < 3) {
      const next = document.getElementById('otp-' + (index + 1));
      next?.focus();
    }
    this.updateButtonState();
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const prev = document.getElementById('otp-' + (index - 1));
      prev?.focus();
    }
  }

  updateButtonState() {
    const allFilled = this.otp.every((x) => x.length === 1);
    this.verifyDisabled.set(!allFilled);
  }

  verifyCode() {
    const formData = new FormData();
    formData.append('otp', this.otp.join(''));
    formData.append('phone', this._AuthService.phoneNumber());
    this._AuthService.VerifyAccount(formData).subscribe({
      next: (res) => {
        console.log(res.message);
        this._ToastrService.success(res.message, 'successfully');
        if (this.FormID() === '1') {
          this.Router.navigate(['/auth/resetPassword']);
        } else {
          this.Router.navigate(['/auth/login']);
        }
      },
    });
  }
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.FormID.set(params.get('id'));
    });
  }
}
