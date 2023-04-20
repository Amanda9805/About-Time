import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NewPost } from '@mp/api/createpost/util';
import { Discipline } from '@mp/api/createpost/util';
import { IUser } from '@mp/api/users/util';
import { Status } from '@mp/api/createpost/util';
import { now } from 'moment';

@Injectable()
export class CreatePostRepository {

     async createPost(post : NewPost){
        // Query the database to add post to the user profile
        const userId = "";
        const title = post.title;
        const author  = post.author;
        const description = post.description;
        const content = post.content;
        const discipline = this.interpretDiscipline(post.discipline);
        const time = 0;
        const image = post.image;

        const documents = await admin.firestore()
        .collection("Posts")
        .doc('insertPostIDHere')
        .set({
            id : 'insertPostIDHere',
            userId : author,
            created : new Date(),
            status: 'idk',
            title : title,
            postDetails : {
                desc : description,
                content : content,
                discipline : discipline
            },
            timeWatched : time
        }).then(() =>{
            const newDocuments  = admin.firestore()
            .collection("PostPhotos")
            .doc('insertPostIDHere')
            .set({
                postId : 'insertPostIDHere',
                image : image
            }).catch(()=>{
                return Status.FAILURE;
            })
        }).then(()=>{
            return Status.SUCCESS;
        })
        .catch(()=>{
            return Status.FAILURE;
        })

        return Status.FAILURE;
    }

    interpretDiscipline(disciplineStr: string) {
        if (disciplineStr.toLowerCase() == "art") {
          return Discipline.ART;
        } else if (disciplineStr.toLowerCase() == "food") {
          return Discipline.FOOD;
        } else if (disciplineStr.toLowerCase() == "gaming") {
          return Discipline.GAMING;
        } else if (disciplineStr.toLowerCase() == "sport") {
          return Discipline.SPORT;
        } else if (disciplineStr.toLowerCase() == "science") {
          return Discipline.SCIENCE;
        } else if (disciplineStr.toLowerCase() == "news") {
          return Discipline.NEWS;
        } else if (disciplineStr.toLowerCase() == "travel") {
          return Discipline.TRAVEL;
        } else {
          return Discipline.MUSIC;
        }
    
      }
}

