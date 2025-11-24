import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashes.component.html',
  styleUrl: './dashes.component.scss',
})
export class DashesComponent implements OnInit {
  private readonly _SharedService = inject(SharedService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  id = inject(PLATFORM_ID);
  dashes = signal<any>([]);
  CatId = signal<string | null>('');
  searchValue = signal<string>('');

  getdashes() {
    this._SharedService.dashes(this.CatId(), this.searchValue()).subscribe({
      next: (res: any) => {
        const data = res.data.map((item: any) => ({
          ...item,
          quantity: signal(1),
        }));
        this.dashes.set(data);
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
    this.getdashes();
  }
  addProductToCart(item: any) {
    const payload = {
      quantity: item.quantity(),
    };
    this._SharedService.addToCart(item.id, payload);
  }
  onSearch(event: any) {
    this.searchValue.set(event.target.value);
    this.getdashes();
  }

  onEnter() {
    this.getdashes();
  }
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.CatId.set(params.get('id'));
    });
    if (isPlatformBrowser(this.id)) {
      this.getdashes();
    }
  }
}
