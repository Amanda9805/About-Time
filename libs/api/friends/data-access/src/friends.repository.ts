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
        const toReturn = {
            data : [
                {
                    id : "friend_1",
                    username : "Fire Lord Edwin",
                    image : 'https://cdn.onlinewebfonts.com/svg/img_522399.png'//random image from web
                }, 
                {
                    id : "friend_2",
                    username : "MadKea",
                    image : 'https://cdn.onlinewebfonts.com/svg/img_522399.png' //random image from web
                },
                {
                    id : "friend_3",
                    username : "Lucky Luke",
                    image : 'https://cdn.onlinewebfonts.com/svg/img_522399.png' //random image from web
                }
            ]
        };

        return toReturn;
    }

   async removeFriend( user : IUser, miniProfile : MinimisedProfile){
    return Status.SUCCESS
   }
}