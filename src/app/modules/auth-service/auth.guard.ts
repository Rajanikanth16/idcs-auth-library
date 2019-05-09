import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  loggedIn: Boolean = false;

  constructor(private router: Router, private auth: AuthService) { }
  canActivate(activatedRoute: ActivatedRouteSnapshot) {
    let state: string;
    if (activatedRoute.firstChild !== null) {
      state = activatedRoute.routeConfig.path;
    } else {
      state = "/";
    }
    localStorage.setItem('current_route', state);
    if (!this.isLoggedIn()) {
      this.auth.getAuthCode(state);
    }
    return this.isLoggedIn();
  }

  canActivateChild(activatedRoute: ActivatedRouteSnapshot) {
    if (this.canActivate(activatedRoute)) {
      return true;
    } else {
      return false;
    }
  }

  private isLoggedIn(): boolean {
    if (localStorage.getItem('access_token')) {
      return true;
    }
    return false;
  }
}
