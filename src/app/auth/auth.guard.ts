import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

// A guard is just a service in the end!

// This is required because we are injecting another service (AuthService) into this service
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state:  RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		const isAuthenticated = this.authService.isAuthenticated();
		if (!isAuthenticated) {
			this.router.navigate(['/login']);
		}
		return isAuthenticated;
	}
}