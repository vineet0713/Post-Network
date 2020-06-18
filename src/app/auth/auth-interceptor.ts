import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

import { AuthService } from './auth.service';

// Interceptors are actually Services!

// This is required because we are injecting another service (AuthService) into this service
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) { }

	// Angular will call this method for all requests leaving the application!
	intercept(request: HttpRequest<any>, next: HttpHandler) {
		const authToken = this.authService.getToken();
		// We need to make a copy of the request, since modifying the original one will cause unwanted side effects!
		const authRequest = request.clone({
			// This edits the request clone!
			headers: request.headers.set('Authorization', `Bearer ${authToken}`),		// 'set' adds a new header to the existing headers
		});
		return next.handle(authRequest);
	}
}