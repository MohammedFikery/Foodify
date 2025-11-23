import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthRoutingModule } from "../../../auth/auth-routing.module";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, AuthRoutingModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
