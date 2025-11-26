import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { IPaymentMethod } from '../../interfaces/IPaymentMethod';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly payService = inject(PaymentService);
  private readonly SharedService = inject(SharedService);
  private readonly ToastrService = inject(ToastrService);

  methods = signal<IPaymentMethod[]>([]);
  selected = signal<IPaymentMethod | null>(null);
  loading = signal<boolean>(false);

  cart = computed(() => ({
    total_items: this.SharedService.total_items(),
    total_price: this.SharedService.total_price(),
  }));

  ngOnInit() {
    this.loadMethods();
  }

  loadMethods() {
    this.payService.getPaymentMethods().subscribe({
      next: (res) => {
        const list = res.data || [];
        this.methods.set(list);

        const def = list.find((x: any) => x.is_default);
        this.selected.set(def || list[0] || null);
      },
    });
  }

  select(m: IPaymentMethod) {
    this.selected.set(m);
  }

  getMasked(card: string) {
    return card ? `**** **** **** ${card.slice(-4)}` : '****';
  }

  getIcon(type: string) {
    switch (type) {
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
  canPay = computed(
    () =>
      this.cart().total_price > 0 &&
      this.cart().total_items > 0 &&
      !this.loading()
  );

  pay() {
    if (!this.selected()) {
      this.ToastrService.warning('Please select a payment method');
      return;
    }
    this.loading.set(true);
    this.payService.processOrder(this.selected()!.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.ToastrService.success('Payment Completed Successfully');
      },
      error: () => this.loading.set(false),
    });
  }
}
