import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private token: string = null;
	private API_URL = 'http://localhost:5000/api/';

	constructor(private httpClient: HttpClient, private router: Router) { }

	getToken() { return this.token; }
	isAuthenticated() {
		if (!this.token) {
			return false;
		}
		const authData = this.getAuthData();
		if (!authData) {
			return false;
		}
		const now = new Date();
		const expiresIn = authData.expirationDate.getTime() - now.getTime();
		if (expiresIn <= 0) {
			return false;
		}
		return true;
	}

	createUser(username: string, password: string) {
		const authData: AuthData = {
			username: username,
			password: password,
		};
		const endpoint = this.API_URL + 'signup';
		this.httpClient.post(endpoint, authData).subscribe(response => this.router.navigate(['/login']));
	}

	loginUser(username: string, password: string) {
		const authData: AuthData = {
			username: username,
			password: password,
		};
		const endpoint = this.API_URL + 'login';
		type responseType = { token: string, expiresIn: number };
		this.httpClient.post<responseType>(endpoint, authData).subscribe(response => {
			this.token = response.token;
			const expiresInDurationMilliseconds = response.expiresIn * 1000;	// multiply by 1000 to convert seconds to milliseconds
			const now = new Date();
			const expirationDate = new Date(now.getTime() + expiresInDurationMilliseconds);
			this.saveAuthData(this.token, expirationDate);
			this.router.navigate(['/']);
		});
	}

	logoutUser() {
		this.token = null;
		this.clearAuthData();
		this.router.navigate(['/login']);
	}

	private saveAuthData(token: string, expirationDate: Date) {
		localStorage.setItem('token', token);
		localStorage.setItem('expirationDate', expirationDate.toISOString());
	}

	private clearAuthData() {
		localStorage.removeItem('token');
		localStorage.removeItem('expirationDate');
	}

	// Automatically authenticates the user, if expirationDate is valid
	autoAuthUser() {
		const authData = this.getAuthData();
		if (authData) {
			const now = new Date();
			const expiresIn = authData.expirationDate.getTime() - now.getTime();
			if (expiresIn > 0) {
				this.token = authData.token;
			}
		}
	}

	private getAuthData() {
		const token = localStorage.getItem('token');
		const expirationDateString = localStorage.getItem('expirationDate');
		if (!token || !expirationDateString) {
			return;
		}
		return {
			token: token,
			expirationDate: new Date(expirationDateString),
		};
	}
}