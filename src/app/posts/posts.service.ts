import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private httpClient: HttpClient) { }

	getPostsUpdatedListener() { return this.postsUpdated.asObservable(); }

	addPost(post: Post) {
		const responseHandler = response => {
			post.id = response.postId;
			this.posts.push(post);
			this.postsUpdated.next([...this.posts]);
		};
		type responseType = { message: string };
		const endpoint = 'http://localhost:5000/api/post';
		this.httpClient.post<responseType>(endpoint, post).subscribe(responseHandler);
	}

	fetchPosts() {
		type responseType = { message: string, posts: any };
		const endpoint = 'http://localhost:5000/api/posts';
		this.httpClient.get<responseType>(endpoint)
			// Use 'pipe' because the data returned will not be in same format as Post interface we have on client!
			.pipe(map(postData => {
				return postData.posts.map(post => {
					return {
						id: post._id,
						title: post.title,
						content: post.content,
					};
				});
			}))
			.subscribe(fetchedPosts => {
				this.posts = fetchedPosts;
				this.postsUpdated.next([...this.posts]);
			});
	}

	deletePost(postIdToDelete: string) {
		const responseHandler = response => {
			const updatedPosts = this.posts.filter(post => post.id !== postIdToDelete);
			this.posts = updatedPosts;
			this.postsUpdated.next([...this.posts]);
		};
		type responseType = { message: string };
		const endpoint = 'http://localhost:5000/api/post/' + postIdToDelete;
		this.httpClient.delete(endpoint).subscribe(responseHandler);
	}
}