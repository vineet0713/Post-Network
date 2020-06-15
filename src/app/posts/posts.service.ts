import { Injectable } from '@angular/core';

import { Post } from './post.model';

import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private posts: Post[] = [];
	private postAdded = new Subject<Post>();

	getPosts() {
		// Using spread operator to make a copy of 'posts', since it's a reference type!
		return [...this.posts];
	}
	addPost(post: Post) {
		this.posts.push(post);
		this.postAdded.next(post);
	}
	getPostAddedListener() { return this.postAdded.asObservable(); }
}