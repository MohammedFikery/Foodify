import { Component } from '@angular/core';
import { AuthRoutingModule } from '../../../auth/auth-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AuthRoutingModule, AuthRoutingModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
