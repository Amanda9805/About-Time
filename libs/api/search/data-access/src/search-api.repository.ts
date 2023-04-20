import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import { UserList } from '@mp/api/search/util';
import { MinimizedProfile } from '@mp/api/search/util';
import { IUser } from '@mp/api/users/util';
import { Status } from '@mp/api/search/util';

@Injectable()
export class SearchRepository {

    async search(user : string){
        

        
    const document = await admin.firestore()
    .collection("Profiles")
    .get();


    const profileIDs = new Map<string, string>();
    document.forEach((doc) =>{
        const data = doc.data();
        if (data["accountDetails"]["userName"].includes(user)){
            profileIDs.set(data["userId"], data["accountDetails"]["userName"])
        }
    })

    const idAndImage = new Map<string, string>();
  

    const userImageDocument = await admin.firestore()
    .collection("UserPhotos")
    .where("userId", "in", profileIDs.keys())
    .get().then((userImageList) =>  {
      userImageList.forEach((userImage) => {
        const data = userImage.data();
        idAndImage.set(data["userId"], data["image"])
      })
    });

    const toReturn: { username: string | undefined; imageURL: string; }[] = []; 

    idAndImage.forEach((value, key) => {
        toReturn.push({
            imageURL: value,
            username : profileIDs.get(key)
        })
    })
        
        return {data: toReturn};
    }

}
