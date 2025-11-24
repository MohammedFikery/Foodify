import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeService } from '../../services/home.service';
import { SharedService } from '../../../core/services/shared.service';
import { Irecommended } from '../../interfaces/Irecommended';
import { ICategories } from '../../interfaces/ICategories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  id = inject(PLATFORM_ID);
  private readonly _HomeService = inject(HomeService);
  private readonly _SharedService = inject(SharedService);

  foods = signal<Irecommended[]>([]);
  categories = signal<any>([]);
  searchValue = signal<string>('');

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 16,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplaySpeed: 400,
    autoplayHoverPause: true,
    autoHeight: false,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      992: { items: 4 },
      1200: { items: 5 },
    },
  };

  getStars(rating: number) {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number) {
    return Array(5 - rating).fill(0);
  }

  getRecommended() {
    this._HomeService.recommended().subscribe({
      next: (res: any) => {
        const data = res.data.map((item: any) => ({
          ...item,
          quantity: signal(1),
        }));
        this.foods.set(data);
      },
    });
  }

  getCategories() {
    this._SharedService.categories(this.searchValue()).subscribe({
      next: (res: any) => {
        this.categories.set(res.data);
      },
    });
  }

  increaseQty(item: any): void {
    item.quantity.update((q: number) => q + 1);
  }

  decreaseQty(item: any): void {
    item.quantity.update((q: number) => (q > 1 ? q - 1 : q));
  }

  addProductToCart(item: any) {
    const payload = {
      quantity: item.quantity(),
    };
    this._SharedService.addToCart(item.id, payload);
  }
  ToggleFavorites(id: number) {
    this._SharedService.ToggleFavorites(id);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getRecommended();
      this.getCategories();
    }
  }
}
