import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeService } from '../../services/home.service';
import { SharedService } from '../../../core/services/shared.service';
import { Irecommended } from '../../interfaces/Irecommended';
import { AuthRoutingModule } from '../../../auth/auth-routing.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, AuthRoutingModule],
  templateUrl:'./home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly homeService = inject(HomeService);
  private readonly sharedService = inject(SharedService);
  private readonly _ToastrService = inject(ToastrService);

  foods = signal<Irecommended[]>([]);
  categories = signal<any>([]);
  searchValue = signal<string>('');
  itemDetailes = signal<any>(null);

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 16,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplaySpeed: 400,
    autoplayHoverPause: true,
    center: false,

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
    this.homeService.recommended().subscribe({
      next: (res: any) => {
        const mapped = res.data.map((item: any) => ({
          ...item,
          quantity: signal(1),
        }));
        this.foods.set(mapped);
      },
    });
  }
  gitDashesDetails(id: any): void {
    this.sharedService.dashesDetails(id).subscribe({
      next: (res) => {
        this.itemDetailes.set(res.data);
      },
    });
  }
  getCategories() {
    this.sharedService.categories(this.searchValue()).subscribe({
      next: (res: any) => this.categories.set(res.data),
    });
  }

  onSearch(event: any) {
    this.searchValue.set(event.target.value);
    this.getCategories();
  }

  onEnter() {
    this.getCategories();
  }

  increaseQty(item: any) {
    item.quantity.update((q: number) => q + 1);
  }

  decreaseQty(item: any) {
    item.quantity.update((q: number) => (q > 1 ? q - 1 : q));
  }

  addProductToCart(item: any) {
    this.sharedService.addToCart(item.id, { quantity: item.quantity() });
  }

  ToggleFavorites(id: number) {
    this.sharedService.ToggleFavorites(id).subscribe({
      next: (res: any) => {
        this._ToastrService.success(res.message);
      },
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getRecommended();
      this.getCategories();
    }
  }
}
