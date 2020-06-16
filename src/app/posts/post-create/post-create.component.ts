import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';

import { Subscription } from 'rxjs';

@Component({
	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
	// enteredTitle = '';
	// enteredContent = '';
	postForm: FormGroup;

	constructor(private postsService: PostsService) { }

	ngOnInit() {
		this.postForm = new FormGroup({
			'title': new FormControl(null, Validators.required),
			'content': new FormControl(null, Validators.required),
		});
	}

	// onAddPost(postInput: HTMLTextAreaElement) {
	// 	console.dir(postInput);
	// 	this.newPost = postInput.value;
	// }

	onAddPost() {
		const newPost: Post = {
			title: this.postForm.value['title'],
			content: this.postForm.value['content'],
		};
		this.postsService.addPost(newPost);
		this.postForm.reset();
	}
}