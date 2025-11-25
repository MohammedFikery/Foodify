import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
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
  total_price = computed(() => this._SharedService.total_price());

  getCart() {
    this._SharedService.myCart().subscribe({
      next: (res: MyCart) => {
        this.cartItems.set(res.data);
        this.cartSummary.set(res.summary);
        this._SharedService.total_items.set(res.summary.total_items);
        this._SharedService.total_price.set(res.summary.total_price);
      },
    });
  }

  getStars(rating: number) {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number) {
    return Array(5 - rating).fill(0);
  }
  increaseQty(item: ICart): void {
    const newQty = item.quantity + 1;
    this.cartItems.update((items) =>
      items.map((i) =>
        i.id === item.id
          ? {
              ...i,
              quantity: newQty,
              subtotal: newQty * +i.price,
            }
          : i
      )
    );

    this._SharedService.updateCartQuantity(item.id, newQty).subscribe({
      next: (res) => {
        this._SharedService.total_items.set(res.total_items);
        this._SharedService.total_price.set(res.total_price);

        this.cartItems.update((items) =>
          items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: res.data.quantity,
                  subtotal: res.data.quantity * +i.price,
                }
              : i
          )
        );
      },
    });
  }

  decreaseQty(item: ICart): void {
    if (item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    this.cartItems.update((items) =>
      items.map((i) =>
        i.id === item.id
          ? {
              ...i,
              quantity: newQty,
              subtotal: newQty * +i.price,
            }
          : i
      )
    );
    this._SharedService.updateCartQuantity(item.id, newQty).subscribe({
      next: (res) => {
        this._SharedService.total_items.set(res.total_items);
        this._SharedService.total_price.set(res.total_price);
        this.cartItems.update((items) =>
          items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: res.data.quantity,
                  subtotal: res.data.quantity * +i.price,
                }
              : i
          )
        );
      },
    });
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
