import { ToastrService } from 'ngx-toastr';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent implements OnInit {
  private readonly _SharedService = inject(SharedService);
  private readonly _ToastrService = inject(ToastrService);
  id = inject(PLATFORM_ID);
  Favorite = signal<any>([]);
  selectedItem = signal<any>(null);
  isModalOpen = signal(false);
  itemDetailes = signal<any>(null);

  getFavorite() {
    this._SharedService.myFavorite().subscribe({
      next: (res: any) => {
        const data = res.data.map((item: any) => ({
          ...item,
          quantity: signal(1),
        }));
        this.Favorite.set(data);
      },
    });
  }
  gitDashesDetails(id: number): void {
    this._SharedService.dashesDetails(id).subscribe({
      next: (res) => {
        this.itemDetailes.set(res.data);
      },
    });
  }
  getStars(rating: number) {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number) {
    return Array(5 - rating).fill(0);
  }

  increaseQty(item: any): void {
    item.quantity.update((q: number) => q + 1);
  }

  decreaseQty(item: any): void {
    item.quantity.update((q: number) => (q > 1 ? q - 1 : q));
  }
  ToggleFavorites(id: number) {
    this._SharedService.ToggleFavorites(id).subscribe({
      next: (res: any) => {
        this._ToastrService.success(res.message);
        this.getFavorite();
      },
    });
  }

  addProductToCart(item: any) {
    const payload = {
      quantity: item.quantity(),
    };
    this._SharedService.addToCart(item.id, payload);
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getFavorite();
    }
  }
}
