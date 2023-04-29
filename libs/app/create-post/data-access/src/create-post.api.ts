import { Injectable } from "@angular/core";
import { Functions, httpsCallable } from '@angular/fire/functions';
import { NewPost as INewPost, CreatePostRequest as ICreatePostRequest, CreatePostResponse as ICreatePostResponse, NewPost, CreatePostRequest } from '@mp/api/createpost/util';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { getAuth } from "@angular/fire/auth";
import cuid from 'cuid';
import { Router } from "@angular/router";

@Injectable()
export class CreatePostApi {
    constructor(
        private readonly functions: Functions,
        private router: Router
    ) { }

    async createPost(request: ICreatePostRequest) {
        const response = await httpsCallable<ICreatePostRequest, ICreatePostResponse>(this.functions, 'createPost')(request);
        this.router.navigate(['/home/feed']);
        return response;
    }

    async uploadPicture(input: File, post: INewPost) {
        const file = input;
        const name = cuid();
        const storage = getStorage();
        const storageRef = ref(storage, `posts/${name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    var newPost: NewPost = { ...post };
                    newPost.author = getAuth().currentUser?.uid as string;
                    newPost.image = downloadURL as string;
                    const CPRequest: CreatePostRequest = { post: newPost };
                    const response = await this.createPost(CPRequest);
                    return response;
                });
            }
        );
    }

}