import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';

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
	isLoading = false;

	totalPosts = 0;
	postsPerPage = 5;
	currentPage = 1;
	pageOptions = [1, 2, 5, 10];

	private postsUpdatedSubscription: Subscription;

	constructor(private postsService: PostsService) { }

	ngOnInit() {
		this.loadPosts();
	}

	loadPosts() {
		this.isLoading = true;
		this.postsService.fetchPosts(this.postsPerPage, this.currentPage);
		type responseType = { posts: Post[], totalPosts: number };
		this.postsUpdatedSubscription = this.postsService.getPostsUpdatedListener().subscribe((postData: responseType) => {
			this.posts = postData.posts;
			this.totalPosts = postData.totalPosts;
			this.isLoading = false;
		});
	}

	ngOnDestroy() { this.postsUpdatedSubscription.unsubscribe(); }

	onDeletePost(postIdToDelete: string, imagePathToDelete: string) {
		const imageFilename = imagePathToDelete.split('/').pop();
		const filenameArray = imageFilename.split('.');	// first element is filename, second element is file extension
		this.isLoading = true;
		this.postsService.deletePost(postIdToDelete, filenameArray[0], filenameArray[1], this.postsPerPage, this.currentPage);
	}

	onChangedPage(pageData: PageEvent) {
		this.currentPage = pageData.pageIndex + 1;
		this.postsPerPage = pageData.pageSize;
		this.loadPosts();
	}
}