import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { AuthService } from './../auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	buttonText: string;
	isLoading = false;
	isSignup = false;

	constructor(private route: ActivatedRoute, private authService: AuthService) { }

	ngOnInit() {
		this.loginForm = new FormGroup({
			'username': new FormControl(null, Validators.required),
			'password': new FormControl(null, Validators.required),
		});
		this.route.url.subscribe((urlSegment: UrlSegment[]) => {
			// This is called whenever the route URL changes
			const path = urlSegment[0].path;
			this.isSignup = (path === 'signup');
			this.buttonText = (this.isSignup) ? 'Sign up' : 'Login';
		});
	}

	onLogin() {
		const username = this.loginForm.value['username'];
		const password = this.loginForm.value['password'];
		if (this.isSignup) {
			this.authService.createUser(username, password);
		} else {
			this.authService.loginUser(username, password);
		}
	}
}