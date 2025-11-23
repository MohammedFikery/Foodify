import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Irecommended } from '../../interfaces/Irecommended';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  id = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getRecommended();
    }
  }
  private readonly _HomeService = inject(HomeService);
  foods: Irecommended[] = [];

  getStars(rating: number) {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number) {
    return Array(5 - rating).fill(0);
  }
  getRecommended() {
    this._HomeService.recommended().subscribe({
      next: (res: any) => {
        this.foods = res.data;
      },
    });
  }
}
