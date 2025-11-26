import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IPaymentMethod } from '../../interfaces/IPaymentMethod';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss',
})
export class PaymentMethodsComponent implements OnInit {
  private readonly _PaymentService = inject(PaymentService);
  private readonly _fb = inject(FormBuilder);

  methods = signal<IPaymentMethod[]>([]);
  isLoading = signal<boolean>(false);

  paymentForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadMethods();
  }

  private initForm(): void {
    this.paymentForm = this._fb.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      details: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      csv: ['', [Validators.maxLength(4)]],
      expire_date: ['', Validators.required],
      is_default: [false],
    });
  }

  get f() {
    return this.paymentForm.controls;
  }

  loadMethods(): void {
    this.isLoading.set(true);
    this._PaymentService.getPaymentMethods().subscribe({
      next: (res) => {
        this.methods.set((res.data as IPaymentMethod[]) || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  submitForm(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const value = this.paymentForm.value;
    this.isLoading.set(true);

    this._PaymentService
      .addPaymentMethod({
        type: value.type,
        name: value.name,
        details: value.details,
        csv: value.csv,
        expire_date: value.expire_date,
        is_default: value.is_default,
      })
      .subscribe({
        next: () => {
          this.paymentForm.reset({
            type: '',
            is_default: false,
          });
          this.loadMethods();
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  deleteMethod(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Are you sure you want to remove this payment method?'))
      return;

    this.isLoading.set(true);

    this._PaymentService.deletePaymentMethod(id).subscribe({
      next: () => {
        this.loadMethods();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  setDefault(id: number | undefined): void {
    if (!id) return;

    this.isLoading.set(true);

    this._PaymentService.setDefaultPaymentMethod(id).subscribe({
      next: () => {
        this.loadMethods();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  getMaskedDetails(details: string | null | undefined): string {
    if (!details) return '****';
    return `**** **** **** ${details.slice(-4)}`;
  }

  getTypeIcon(type: string | null | undefined): string {
    switch ((type || '').toLowerCase()) {
      case 'visa':
        return 'fa-brands fa-cc-visa';
      case 'mastercard':
        return 'fa-brands fa-cc-mastercard';
      case 'wallet':
        return 'fa-solid fa-wallet';
      default:
        return 'fa-solid fa-credit-card';
    }
  }
  fieldHasError(field: string, error: string) {
    const control = this.paymentForm.get(field);
    return control?.hasError(error) && (control?.dirty || control?.touched);
  }
}
