import { Injectable, inject } from "@angular/core";
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { NewPost as INewPost, CreatePostRequest as ICreatePostRequest, CreatePostResponse as ICreatePostResponse, NewPost, CreatePostRequest } from '@mp/api/createpost/util';
import { Storage, getStorage, ref, uploadBytesResumable, uploadString, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { getAuth } from "@angular/fire/auth";
import cuid from 'cuid';
import { AddToPostList } from '@mp/app/feed/util';

@Injectable()
export class CreatePostApi {
    constructor(
        private readonly firestore: Firestore,
        private readonly functions: Functions,
        private readonly storage: Storage,
        // private progress: number,
    ) { }

    private progress: number = 0;

    async createPost(request: ICreatePostRequest) {
        const response = await httpsCallable<ICreatePostRequest, ICreatePostResponse>(this.functions, 'createPost')(request);
        console.log(response);

        return response;
    }

    async uploadPicture(input: File, post: INewPost) {
        const file = input;
        const name = cuid();
        const storage = getStorage();
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                this.progress = progress;
                if (this.progress == 1) {
                    this.progress = 0.9;
                    setInterval(() => {
                        this.progress += 0.01;
                    }, 300);
                }

                switch (snapshot.state) {
                    case 'paused':
                        // console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                }
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
                    console.log(response);
                });
            }
        );
    }

}