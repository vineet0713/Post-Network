import { environment } from '../../environments/environment';

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
	private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>();

	constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

	getPostsUpdatedListener() { return this.postsUpdated.asObservable(); }

	uploadImageFile(imageFile: File, title: string) {
		if (!this.authService.isAuthenticated()) {
			alert('Your auth token expired. Please login again.');
			this.router.navigate(['/login']);
			return;
		}
		const imageData = new FormData();
		imageData.append('file', imageFile, title);	// 'post.title' will be the filename of image
		const endpoint = environment.API_URL + 'uploadimage';
		return this.httpClient.post(endpoint, imageData).toPromise();
	}

	removeImageFile(imagePath: string) {
		const payload = { imagePath: imagePath }
		const endpoint = environment.API_URL + 'deleteimage';
		return this.httpClient.post(endpoint, payload).toPromise();
	}

	addPost(post: Post) {
		const postData = {
			title: post.title,
			content: post.content,
			imagePath: post.imagePath,
		};
		const endpoint = environment.API_URL + 'post';
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
		const endpoint = environment.API_URL + 'posts' + queryParams;
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
							creatorUsername: post.creator.username,
							creatorId: post.creator._id,
						};
					}),
				};
			}))
			.subscribe(postData => this.postsUpdated.next({...postData}));
	}

	deletePost(postIdToDelete: string, pageSize: number, page: number) {
		const endpoint = environment.API_URL + 'post/' + postIdToDelete;
		const successResponse = response => this.fetchPosts(pageSize, page);
		const errorResponse = error => {
			if (error.status === 401) {
				if (error.error.message === 'Not authorized to delete this post!') {
					alert('You did not create this post, so you cannot delete it.');
					this.router.navigate(['/create']);
				} else {
					alert('Your auth token expired. Please login again.');
					this.router.navigate(['/login']);
				}
			} else {
				alert('An error occurred. Please try again.');
			}
		};
		this.httpClient.delete(endpoint).subscribe(successResponse, errorResponse);
	}

	updatePost(postIdToUpdate: string, postData: Post) {
		if (!this.authService.isAuthenticated()) {
			alert('Your auth token expired. Please login again.');
			this.router.navigate(['/login']);
			return;
		}
		const endpoint = environment.API_URL + 'post/' + postIdToUpdate;
		const successResponse = result => this.router.navigate(['/']);
		const errorResponse = error => {
			if (error.status === 401) {
				if (error.error.message === 'Not authorized to update this post!') {
					alert('You did not create this post, so you cannot modify it.');
					this.router.navigate(['/']);
				} else {
					alert('Your auth token expired. Please login again.');
					this.router.navigate(['/login']);
				}
			} else {
				alert('An error occurred. Please try again.');
			}
		};
		this.httpClient.put(endpoint, postData).subscribe(successResponse, errorResponse);
	}

	getPost(postIdToGet: string) {
		const endpoint = environment.API_URL + 'post/' + postIdToGet;
		type responseType = { message: string, post: any };
		return this.httpClient.get<responseType>(endpoint);
	}
}