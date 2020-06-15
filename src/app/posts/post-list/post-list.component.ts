import { Component, OnInit, OnDestroy } from '@angular/core';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';

import { Subscription } from 'rxjs';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
	posts: Post[] = [];
	private postAddedSubscription: Subscription;

	constructor(private postsService: PostsService) { }

	ngOnInit() {
		this.posts = this.postsService.getPosts();
		this.postAddedSubscription = this.postsService.getPostAddedListener().subscribe((newPost: Post) => {
			this.posts.push(newPost);
		});
	}

	ngOnDestroy() { this.postAddedSubscription.unsubscribe(); }
}