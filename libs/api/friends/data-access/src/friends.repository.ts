import { Module } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin"

import { Status } from "@mp/api/friends/util";
import { FriendsList } from "@mp/api/friends/util";
import { MinimisedProfile } from "@mp/api/friends/util";
import {IUser} from '@mp/api/users/util';

@Injectable()
export class FriendsRepository {
    async getFriends( miniProfile : MinimisedProfile){
        //Query the database to return the user's friends list

        const UserId = miniProfile.id;  //the id of the user 
        let documents;


        if (UserId != null) {
            documents = await admin.firestore()
                    .collection('Friends')
                    .where('userId','==', UserId)  //finding all the friends of the user through the user id
                    .orderBy('friendName', 'asc')
                    .get();
        }
        else {
            console.log('User not found'); //if the user is not found 
        }

        console.log(`Documents retrieved: ${documents}`);

        const toReturn : {id: string; friend: string; image: string; }[] = []; //return the list of friends minimised profile 

        documents?.forEach((doc) => {
            const currentDoc = doc.data();

            toReturn.push({
                id: currentDoc['id'],
                friend: currentDoc['friend'],
                image: currentDoc['image'],
            });
            
        });

        return { data: toReturn };

        //MOCK DATA BELOW
        // const toReturn = {
        //     data : [
        //         {
        //             id : "friend_1",
        //             username : "Fire Lord Edwin",
        //             image : 'https://cdn.onlinewebfonts.com/svg/img_522399.png'//random image from web
        //         }, 
        //         {
        //             id : "friend_2",
        //             username : "MadKea",
        //             image : 'https://cdn.onlinewebfonts.com/svg/img_522399.png' //random image from web
        //         },
        //         {
        //             id : "friend_3",
        //             username : "Lucky Luke",
        //             image : 'https://cdn.onlinewebfonts.com/svg/img_522399.png' //random image from web
        //         }
        //     ]
        // };
    }

   async removeFriend( user : IUser, miniProfile : MinimisedProfile) : Promise<Status>{
     //Query the database to remove a friend from the friends list

    const userId = user.id;
    const userName = user.userName;
    const friendId = miniProfile.id;
    const friendName = miniProfile.username;

    const documents = await admin.firestore()
    .collection("Profiles")
    .where("userId", "==", userId)
    .get();

    const profile = documents.docs[0];
    const userRef = profile.data()['accountDetails'];

    const removeFriend = userRef.update({
        friends: admin.firestore.FieldValue.arrayRemove(friendId),
    });
                  

    removeFriend.then(() => {
        console.log(`Friend ${friendName} removed from user ${userName}'s friends list.`);
        
      }).catch(() => {
        console.error(`Error removing friend from user's friends list`);
        return Status.FAILURE;
      });


    return Status.SUCCESS
   }
}