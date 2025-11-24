import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent implements OnInit {
  private readonly _SharedService = inject(SharedService);
  id = inject(PLATFORM_ID);
  searchValue = signal<string>('');
  Favorite = signal<any>([]);
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
    this._SharedService.ToggleFavorites(id);
    this.getFavorite();
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
