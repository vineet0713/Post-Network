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
	private postsUpdatedSubscription: Subscription;

	constructor(private postsService: PostsService) { }

	ngOnInit() {
		this.postsService.fetchPosts();
		this.postsUpdatedSubscription = this.postsService.getPostsUpdatedListener().subscribe((fetchedPosts: Post[]) => {
			console.log(fetchedPosts);
			this.posts = fetchedPosts;
		});
	}

	ngOnDestroy() { this.postsUpdatedSubscription.unsubscribe(); }

	onDeletePost(postIdToDelete: string) {
		this.postsService.deletePost(postIdToDelete);
	}

	onEditPost(postIdToEdit: string) {}
}