import { Module } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin"

import { Status } from "@mp/api/friends/util";
import { FriendsList } from "@mp/api/friends/util";
import { MinimisedProfile } from "@mp/api/friends/util";
import { IUser } from '@mp/api/users/util';

@Injectable()
export class FriendsRepository {
    async getFriends(miniProfile: MinimisedProfile) {
        //Query the database to return the user's friends list

        const UserId = miniProfile.id;  //the id of the user 
        let documents;
        const friendIDs: string[] = [];

        if (UserId != null) {
            documents = await admin.firestore()
                .collection('profiles')
                .where('userId', '==', UserId)  //finding the Profile for the user in question
                .get();
                
            if (documents){
                if (documents.empty) {
                    return { data: [] }; // return no friends
                } else {
                    const details = documents.docs[0].data()['accountDetails'];
                    const friends = details['friends'];
                    friends.forEach((id: string) => {
                        friendIDs.push(id);
                    })
                }
            } else {
                return { data: [] };
            }

        }
        else {
            return { data: [] }; // return no friends
        }

        console.log(`Documents retrieved: ${documents}`);

        const toReturn: { id: string; username: string; image: string; }[] = []; //return the list of friends minimised profile 

        const friendProfilesDocuments = await admin.firestore()
            .collection("profiles")
            .where("userId", "in", friendIDs)
            .get();
            
        if (friendProfilesDocuments) {
            friendProfilesDocuments.forEach((profile) =>{
                const data = profile.data();
                toReturn.push({id: data["userId"], username: data["accountDetails"]["userName"], image:data["photoURL"]})
            })
        }   

        return {data:toReturn};
            
 
    }

    async removeFriend(user: IUser, miniProfile: MinimisedProfile): Promise<Status> {
        //Query the database to remove a friend from the friends list

        const userId = user.id;
        const userName = user.userName;
        const friendId = miniProfile.id;
        const friendName = miniProfile.username;

        const documents = await admin.firestore()
            .collection("profiles")
            .where("userId", "==", userId)
            .get();

        const profile = documents.docs[0];
        const userRef = profile.data()['accountDetails'];

        const removeFriend = userRef.update({
            friends: admin.firestore.FieldValue.arrayRemove(friendId),
        });

        if (removeFriend){
            return Status.SUCCESS
        } else {
            return Status.FAILURE;
        }




       
    }
}