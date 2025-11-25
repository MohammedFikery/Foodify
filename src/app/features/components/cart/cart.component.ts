import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AuthRoutingModule } from '../../../auth/auth-routing.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedService } from '../../../core/services/shared.service';
import { ICart, MyCart, Summary } from '../../interfaces/ICart';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AuthRoutingModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly _SharedService = inject(SharedService);
  private readonly _ToastrService = inject(ToastrService);

  id = inject(PLATFORM_ID);

  searchValue = signal<string>('');

  cartItems = signal<ICart[]>([]);
  cartSummary = signal<Summary | null>(null);

  getCart() {
    this._SharedService.myCart().subscribe({
      next: (res: MyCart) => {
        this.cartItems.set(res.data);
        this.cartSummary.set(res.summary);
        this._SharedService.total_items.set(res.summary.total_items);
      },
    });
  }

  getStars(rating: number) {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number) {
    return Array(5 - rating).fill(0);
  }
  RemoveProductFromCart(id: number): void {
    this._SharedService.RemoveFromCart(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message);
        this.getCart();
      },
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getCart();
    }
  }
}
