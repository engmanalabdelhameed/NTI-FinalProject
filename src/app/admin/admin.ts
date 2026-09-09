import { Component } from '@angular/core';

import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/core/auth.service';

@Component({
  selector: 'app-admin',

  standalone: true,

  imports: [RouterOutlet, RouterLink, RouterLinkActive],

  templateUrl: './admin.html',

  styleUrl: './admin.css',
})
export class Admin {
  readonly authService = inject(AuthService);
}
