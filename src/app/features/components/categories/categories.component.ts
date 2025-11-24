import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthRoutingModule } from '../../../auth/auth-routing.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, AuthRoutingModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly _SharedService = inject(SharedService);
  id = inject(PLATFORM_ID);

  searchValue = signal<string>('');
  categories = signal<any>([]);
  getCategories() {
    this._SharedService.categories(this.searchValue()).subscribe({
      next: (res: any) => {
        this.categories.set(res.data);
      },
    });
  }
  onSearch(event: any) {
    this.searchValue.set(event.target.value);
    this.getCategories();
  }

  onEnter() {
    this.getCategories();
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getCategories();
    }
  }
}
