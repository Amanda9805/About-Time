import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import { UserList } from '@mp/api/search/util';
import { IUser } from '@mp/api/users/util';
import { Status } from '@mp/api/search/util';

@Injectable()
export class SearchRepository {

    async search(user : string){

    const document = await admin.firestore()
    .collection("profiles")
    .get();

    const toReturn: { username: string | undefined; imageURL: string; }[] = [];

    const profileIDs = new Map<string, string>();
    document.forEach((doc) =>{
        const data = doc.data();
        if (data["accountDetails"]["userName"].includes(user)){
            toReturn.push({username : data["accountDetails"]["userName"], imageURL:data["photoURL"]});
        }
    })

    return {data: toReturn};

}
}
