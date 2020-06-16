import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';

import { Subscription } from 'rxjs';

@Component({
	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
	postForm: FormGroup;
	editingPost: Post;

	constructor(private postsService: PostsService, private route: ActivatedRoute) { }

	ngOnInit() {
		this.postForm = new FormGroup({
			'title': new FormControl(null, Validators.required),
			'content': new FormControl(null, Validators.required),
		});
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			// This is called whenever the parameters change in the route URL (so we know what post is being edited, if any)
			if (paramMap.has('postId')) {
				const responseHandler = postData => {
					this.editingPost = {
						id: postData.post._id,
						title: postData.post.title,
						content: postData.post.content,
					};
					this.postForm.setValue({
						'title': this.editingPost.title,
						'content': this.editingPost.content,
					});
				}
				this.postsService.getPost(paramMap.get('postId')).subscribe(responseHandler);
			} else {
				this.editingPost = null;
			}
		});
	}

	onAddPost() {
		const newPost: Post = {
			title: this.postForm.value['title'],
			content: this.postForm.value['content'],
		};
		if (!this.editingPost) {
			this.postsService.addPost(newPost);
		} else {
			this.postsService.updatePost(this.editingPost.id, newPost);
		}
		this.postForm.reset();
	}
}