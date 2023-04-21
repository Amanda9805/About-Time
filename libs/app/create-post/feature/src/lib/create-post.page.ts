import { Component } from '@angular/core';
import { PostService } from './post.service'; // Example service for handling post submission
import { Location } from '@angular/common';
import { CreatePost } from '@mp/app/create-post/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CreatePostState } from '@mp/app/create-post/data-access';
import { NewPost } from '@mp/api/createpost/util';
import { ActionsExecuting, actionsExecuting } from '@ngxs-labs/actions-executing';
import { FormBuilder, Validators } from '@angular/forms';
import { SetSuccess } from '@mp/app/success/util';
import { SetError } from '@mp/app/errors/util';

@Component({
  selector: 'mp-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss']
})
export class CreatePostPage {
  // @Select(CreatePostState.post) post$!: NewPost | null;
  @Select(actionsExecuting([CreatePost])) busy$!: Observable<ActionsExecuting>

  createPostForm = this.fb.group({
    title: ['', [Validators.minLength(1), Validators.required]],
    description: ['', [Validators.minLength(1), Validators.required]],
    content: ['', [Validators.minLength(1), Validators.required]],
    discipline: ['', [Validators.minLength(1)]],
    image: ['', [Validators.minLength(1)]]
  });

  protected post: NewPost = {
    title: "",
    description: "",
    author: "",
    content: "",
    discipline: "",
    image: ""
  };

  private sendfile: any;

  get title() {
    return this.createPostForm.get('title')?.value;
  }

  get author() {
    return "user_id";
  }

  get description() {
    return this.createPostForm.get('description')?.value;
  }

  get content() {
    return this.createPostForm.get('content')?.value;
  }

  get discipline() {
    return this.createPostForm.get('discipline')?.value;
  }

  get image() {
    return this.createPostForm.get('image')?.value;
  }

  constructor(private location: Location, private fb: FormBuilder, private readonly store: Store) {
    this.sendfile = null;
  }

  goBack() {
    this.location.back();
  }

  validateForm() {
    // console.log(this.post.title, this.post.description, this.post.content, this.post.discipline, this.sendfile);
    if (!this.post.title || !this.post.description || !this.post.content || !this.post.discipline || !this.sendfile) {
      this.store.dispatch(new SetError(`You are missing input. Check all input fields for possible missing content.`));
      return false;
    }

    return true;

  }

  submitForm() {

    if (!this.validateForm()) {
      return;
    }

    // Call the post service to submit the form data
    this.postService.createPost(this.post)
      .then(response => {
        // Handle successful post submission, e.g., show a success message
        alert('Post created successfully!');
        // Reset form data
        this.post = {
          user: '',
          title: '',
          caption: '',
          link: '',
          tag: '',
          photo: null
        };
      })
      .catch(error => {
        // Handle error, e.g., show an error message
        alert('Failed to create post. Please try again.');
      });
  }

  handleSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    this.post.discipline = target.value;
  }
}
