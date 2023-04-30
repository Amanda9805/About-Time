import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { getAuth } from "@angular/fire/auth";
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Store } from '@ngxs/store';
import { UpdateProfilePicture, } from '@mp/app/profile/util';
import { ProfileImageUpdateResponse, ProfileImageUpdateRequest, IUpdateAccountDetailsRequest, IUpdateAccountDetailsResponse, IDeleteAccountRequest, IDeleteAccountResponse } from '@mp/api/profiles/util';
import { SetSuccess } from "@mp/app/success/util";
import { UpdateUsername } from '@mp/app/profile/util';
import { Router } from '@angular/router';
import { error } from 'console';
import { Logout } from '@mp/app/profile/util';

@Injectable()
export class SettingsApi {
    constructor(private readonly functions: Functions, private readonly store: Store, private router: Router) { }

    async uploadPicture(input: File) {
        const file = input;
        const name = getAuth().currentUser?.uid as string;
        const storage = getStorage();
        const storageRef = ref(storage, `profiles/${name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                console.log("update")
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log(downloadURL);
                    const data: ProfileImageUpdateRequest = {
                        update: {
                            userId: name,
                            newImageURL: downloadURL as string
                        }
                    };
                    const response = await httpsCallable<ProfileImageUpdateRequest, ProfileImageUpdateResponse>(this.functions, 'updateProfileImage')(data);

                    if (response) {
                        this.store.dispatch(new SetSuccess("Profile picture updated successfully"));
                        this.store.dispatch(new UpdateProfilePicture(downloadURL as string));
                    }

                    return downloadURL as string;
                });
            }
        );
    }

    async updateUsername(username: string) {
        const object: IUpdateAccountDetailsRequest = {
            profile: {
                userId: getAuth().currentUser?.uid as string,
                accountDetails: {
                    userName: username
                }
            }
        }
        const response = await httpsCallable<IUpdateAccountDetailsRequest, IUpdateAccountDetailsResponse>(this.functions, 'updateAccountDetails')(object);

        if (response) {
            this.store.dispatch(new SetSuccess("Updated username successfully"));
            this.store.dispatch(new UpdateUsername(username));
        }
    }

    async deleteAccount() {
        const userID = getAuth().currentUser?.uid as string;
        const currentUser = getAuth().currentUser;
        const object: IDeleteAccountRequest = {
            deleteAccount: {
                userId: userID
            }
        }
        const response = await httpsCallable<IDeleteAccountRequest, IDeleteAccountResponse>(this.functions, 'deleteAccount')(object);

        if (response) {
            this.store.dispatch(new Logout());
        }
    }
}