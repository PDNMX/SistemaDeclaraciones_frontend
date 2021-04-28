import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Logger } from '@core';
import { CredentialsService } from './credentials.service';

const log = new Logger('DeclarantGuard');

@Injectable({
  providedIn: 'root',
})
export class DeclarantGuard implements CanActivate {
  constructor(private router: Router, private credentialsService: CredentialsService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialsService.isDeclarant()) {
      return true;
    }

    log.debug('Not authorized, redirecting and adding redirect url...');
    this.router.navigate(['/inicio'], { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }
}
