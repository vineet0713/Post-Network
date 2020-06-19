import { environment } from '../../environments/environment';

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
	private userId: string = null;

	constructor(private httpClient: HttpClient, private router: Router) { }

	getToken() { return this.token; }
	getUserId() { return this.userId; }
	isAuthenticated() {
		if (!this.token || !this.userId) {
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
		const endpoint = environment.API_URL + 'signup';
		const successResponse = response => this.router.navigate(['/login']);
		const errorResponse = error => alert('This username already exists! Please try another one.');
		this.httpClient.post(endpoint, authData).subscribe(successResponse, errorResponse);
	}

	loginUser(username: string, password: string) {
		const authData: AuthData = {
			username: username,
			password: password,
		};
		const endpoint = environment.API_URL + 'login';
		type responseType = { token: string, expiresIn: number, userId: string };
		const successResponse = response => {
			this.token = response.token;
			this.userId = response.userId;
			const expiresInDurationMilliseconds = response.expiresIn * 1000;	// multiply by 1000 to convert seconds to milliseconds
			const now = new Date();
			const expirationDate = new Date(now.getTime() + expiresInDurationMilliseconds);
			this.saveAuthData(this.token, expirationDate, this.userId);
			this.router.navigate(['/']);
		};
		const errorResponse = error => alert('Invalid username or password.');
		this.httpClient.post<responseType>(endpoint, authData).subscribe(successResponse, errorResponse);
	}

	logoutUser() {
		this.token = null;
		this.userId = null;
		this.clearAuthData();
		this.router.navigate(['/login']);
	}

	private saveAuthData(token: string, expirationDate: Date, userId: string) {
		localStorage.setItem('token', token);
		localStorage.setItem('expirationDate', expirationDate.toISOString());
		localStorage.setItem('userId', userId);
	}

	private clearAuthData() {
		localStorage.removeItem('token');
		localStorage.removeItem('expirationDate');
		localStorage.removeItem('userId');
	}

	// Automatically authenticates the user, if expirationDate is valid
	autoAuthUser() {
		const authData = this.getAuthData();
		if (authData) {
			const now = new Date();
			const expiresIn = authData.expirationDate.getTime() - now.getTime();
			if (expiresIn > 0) {
				this.token = authData.token;
				this.userId = authData.userId;
			}
		}
	}

	private getAuthData() {
		const token = localStorage.getItem('token');
		const expirationDateString = localStorage.getItem('expirationDate');
		const userId = localStorage.getItem('userId');
		if (!token || !expirationDateString || !userId) {
			return;
		}
		return {
			token: token,
			expirationDate: new Date(expirationDateString),
			userId: userId,
		};
	}
}