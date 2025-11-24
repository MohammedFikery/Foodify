import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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

  userName = signal<string>('User');
  toggle = false;

  changeToggle(): void {
    this.toggle = !this.toggle;
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const name = localStorage.getItem('userFull_name');
      this.userName.set(name ?? 'User');
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
