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
	imagePreview: string;

	constructor(private postsService: PostsService, private route: ActivatedRoute) { }

	ngOnInit() {
		this.postForm = new FormGroup({
			'title': new FormControl(null, Validators.required),
			'content': new FormControl(null, Validators.required),
			// 'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
			'image': new FormControl(null, Validators.required),
		});
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			// This is called whenever the parameters change in the route URL (so we know what post is being edited, if any)
			if (paramMap.has('postId')) {
				const responseHandler = postData => {
					this.editingPost = {
						id: postData.post._id,
						title: postData.post.title,
						content: postData.post.content,
						imagePath: postData.post.imagePath,
					};
					this.imagePreview = this.editingPost.imagePath;
					this.postForm.setValue({
						'title': this.editingPost.title,
						'content': this.editingPost.content,
						'image': this.editingPost.imagePath,
					});
				}
				this.postsService.getPost(paramMap.get('postId')).subscribe(responseHandler);
			} else {
				this.editingPost = null;
			}
		});
	}

	onAddPost() {
		let newPost: Post = {
			title: this.postForm.value['title'],
			content: this.postForm.value['content'],
		};

		if (!this.editingPost) {
			newPost.image = this.postForm.value['image'];
			this.postsService.addPost(newPost);
		} else {
			if (typeof(this.postForm.value['image']) === 'string') {
				newPost.imagePath = this.postForm.value['image'];
			} else {
				newPost.image = this.postForm.value['image'];
				newPost.imagePath = this.editingPost.imagePath;
			}
			this.postsService.updatePost(this.editingPost.id, newPost);
		}
		this.postForm.reset();
	}

	onImagePicked(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		this.postForm.patchValue({ 'image': file });
		this.postForm.get('image').updateValueAndValidity();
		const reader = new FileReader();
		reader.onload = () => {
			this.imagePreview = reader.result as string;			
		};
		reader.readAsDataURL(file);
	}
}