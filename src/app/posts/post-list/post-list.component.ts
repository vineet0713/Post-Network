import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';

import { PostsService } from './../posts.service';
import { AuthService } from './../../auth/auth.service';
import { Post } from './../post.model';

import { Subscription } from 'rxjs';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
	@ViewChild('paginator', { static: false }) paginator: MatPaginator;

	posts: Post[] = [];
	isLoading = false;

	totalPosts = 0;
	postsPerPage = 5;
	currentPage = 1;
	pageOptions = [1, 2, 5, 10];

	private postsUpdatedSubscription: Subscription;

	constructor(private postsService: PostsService, private authService: AuthService, private router: Router) { }

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

	ngOnDestroy() {
		this.postsUpdatedSubscription.unsubscribe();
	}

	canEditOrDelete(creatorUserId: string) {
		return (this.authService.isAuthenticated()) && (this.authService.getUserId() === creatorUserId);
	}

	onEditPost(postIdToUpdate: string) {
		this.router.navigate(['/edit/', postIdToUpdate]);
	}

	onDeletePost(postIdToDelete: string, imagePathToDelete: string) {
		this.isLoading = true;
		if (this.posts.length === 1 && this.currentPage > 1) {
			// If to-be-deleted post is the only one on the page, then decrement the current page (so the previous page would be viewed)
			this.currentPage--;
			this.paginator.previousPage();
		}
		this.postsService.removeImageFile(imagePathToDelete)
			.then(result => this.postsService.deletePost(postIdToDelete, this.postsPerPage, this.currentPage))
			.catch(error => alert('The image file was not able to be deleted!'));
	}

	onChangedPage(pageData: PageEvent) {
		this.currentPage = pageData.pageIndex + 1;
		this.postsPerPage = pageData.pageSize;
		this.loadPosts();
	}
}