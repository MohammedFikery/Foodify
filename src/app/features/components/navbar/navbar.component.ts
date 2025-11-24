import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  id = inject(PLATFORM_ID);
  userName = signal<string>('User');

  ngOnInit(): void {
    this.getUserDataFromLocalStorage();
  }

  getUserDataFromLocalStorage(): void {
    if (isPlatformBrowser(this.id)) {
      this.userName.set(localStorage.getItem('userFull_name') ?? 'User');
    }
  }
}
