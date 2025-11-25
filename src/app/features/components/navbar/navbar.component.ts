import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedService } from '../../../core/services/shared.service';
import { MyCart } from '../../interfaces/ICart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly _SharedService = inject(SharedService);

  totalItems = computed(() => this._SharedService.total_items());

  userName = signal<string>('User');
  toggle = false;

  changeToggle(): void {
    this.toggle = !this.toggle;
  }

  ngOnInit(): void {
    this.loadUser();
    this.getCart();
  }

  private loadUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const name = localStorage.getItem('userFull_name');
      this.userName.set(name ?? 'User');
    }
  }
  getCart() {
    this._SharedService.myCart().subscribe({
      next: (res: MyCart) => {
        this._SharedService.total_items.set(res.summary.total_items);
      },
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
