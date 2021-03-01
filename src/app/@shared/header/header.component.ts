import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../auth/authentication.service';
import { CredentialsService } from '../../auth/credentials.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isDeclarant = false;

  constructor(
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private router: Router
  ) {
    this.isLoggedIn = this.credentialsService.isAuthenticated();
    this.isAdmin = this.credentialsService.isAdmin();
    this.isDeclarant = this.credentialsService.isDeclarant();
  }

  goTo(route: string) {
    this.router.navigate([`/${route}`], { replaceUrl: true });
  }

  ngOnInit() {}

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
