import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { AuthService } from './../auth/auth.service';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private API_URL = 'http://localhost:5000/api/';
	private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>();

	constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

	getPostsUpdatedListener() { return this.postsUpdated.asObservable(); }

	addPost(post: Post) {
		if (!this.authService.isAuthenticated()) {
			alert('Your auth token expired. Please login again.');
			this.router.navigate(['/login']);
			return;
		}
		const postData = new FormData();
		postData.append('title', post.title);
		postData.append('content', post.content);
		postData.append('image', post.image, post.title);	// 'post.title' will be the filename of image
		const endpoint = this.API_URL + 'post';
		const successResponse = result => this.router.navigate(['/']);
		const errorResponse = error => {
			if (error.status === 401) {
				alert('Your auth token expired. Please login again.');
				this.router.navigate(['/login']);
			} else {
				alert('An error occurred. Please try again.');
			}
		};
		this.httpClient.post(endpoint, postData).subscribe(successResponse, errorResponse);
	}

	fetchPosts(pageSize: number, page: number) {
		const queryParams = `?pageSize=${pageSize}&page=${page}`;
		const endpoint = this.API_URL + 'posts' + queryParams;
		type responseType = { message: string, posts: any, totalPosts: number };
		this.httpClient.get<responseType>(endpoint)
			// Use 'pipe' because the data returned will not be in same format as Post interface we have on client!
			.pipe(map(responseData => {
				return {
					totalPosts: +responseData.totalPosts,
					posts: responseData.posts.map(post => {
						return {
							id: post._id,
							title: post.title,
							content: post.content,
							imagePath: post.imagePath,
						};
					}),
				};
			}))
			.subscribe(postData => {
				this.postsUpdated.next({...postData});
			});
	}

	deletePost(postIdToDelete: string, imagePath: string, imageType: string, pageSize: number, page: number) {
		const endpoint = this.API_URL + 'post/' + postIdToDelete + '?imagePath=' + imagePath + '&imageType=' + imageType;
		const successResponse = response => this.fetchPosts(pageSize, page);
		const errorResponse = error => {
			if (error.status === 401) {
				alert('Your auth token expired. Please login again.');
				this.router.navigate(['/login']);
			} else {
				alert('An error occurred. Please try again.');
			}
		};
		this.httpClient.delete(endpoint).subscribe(successResponse, errorResponse);
	}

	updatePost(postIdToUpdate: string, post: Post) {
		if (!this.authService.isAuthenticated()) {
			alert('Your auth token expired. Please login again.');
			this.router.navigate(['/login']);
			return;
		}
		const endpoint = this.API_URL + 'post/' + postIdToUpdate;
		let postData;
		if (post.image) {
			postData = new FormData();
			postData.append('title', post.title);
			postData.append('content', post.content);
			postData.append('imagePath', post.imagePath);
			postData.append('image', post.image, post.title);	// 'post.title' will be the filename of image
		} else {
			postData = post;
		}
		const successResponse = result => this.router.navigate(['/']);
		const errorResponse = error => {
			if (error.status === 401) {
				alert('Your auth token expired. Please login again.');
				this.router.navigate(['/login']);
			} else {
				alert('An error occurred. Please try again.');
			}
		};
		this.httpClient.put(endpoint, postData).subscribe(successResponse, errorResponse);
	}

	getPost(postIdToGet: string) {
		const endpoint = this.API_URL + 'post/' + postIdToGet;
		type responseType = { message: string, post: any };
		return this.httpClient.get<responseType>(endpoint);
	}
}