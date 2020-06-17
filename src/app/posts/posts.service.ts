import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Post } from './post.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private httpClient: HttpClient, private router: Router) { }

	getPostsUpdatedListener() { return this.postsUpdated.asObservable(); }

	addPost(post: Post) {
		const postData = new FormData();
		postData.append('title', post.title);
		postData.append('content', post.content);
		postData.append('image', post.image, post.title);	// 'post.title' will be the filename of image
		const endpoint = 'http://localhost:5000/api/post';
		this.httpClient.post(endpoint, postData).subscribe(result => this.router.navigate(['/']));
	}

	fetchPosts() {
		const endpoint = 'http://localhost:5000/api/posts';
		type responseType = { message: string, posts: any };
		this.httpClient.get<responseType>(endpoint)
			// Use 'pipe' because the data returned will not be in same format as Post interface we have on client!
			.pipe(map(postData => {
				return postData.posts.map(post => {
					return {
						id: post._id,
						title: post.title,
						content: post.content,
						imagePath: post.imagePath,
					};
				});
			}))
			.subscribe(fetchedPosts => {
				this.posts = fetchedPosts;
				this.postsUpdated.next([...this.posts]);
			});
	}

	deletePost(postIdToDelete: string) {
		const endpoint = 'http://localhost:5000/api/post/' + postIdToDelete;
		type responseType = { message: string };
		const responseHandler = response => {
			const updatedPosts = this.posts.filter(post => post.id !== postIdToDelete);
			this.posts = updatedPosts;
			this.postsUpdated.next([...this.posts]);
		};
		this.httpClient.delete<responseType>(endpoint).subscribe(responseHandler);
	}

	updatePost(postIdToUpdate: string, post: Post) {
		const endpoint = 'http://localhost:5000/api/post/' + postIdToUpdate;
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
		this.httpClient.put(endpoint, postData).subscribe(result => this.router.navigate(['/']));
	}

	getPost(postIdToGet: string) {
		const endpoint = 'http://localhost:5000/api/post/' + postIdToGet;
		type responseType = { message: string, post: any };
		return this.httpClient.get<responseType>(endpoint);
	}
}