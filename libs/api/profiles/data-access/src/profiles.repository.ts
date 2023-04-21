import { IProfile, Post, Status, PrivacyStatus } from '@mp/api/profiles/util';
import { Injectable } from '@nestjs/common';
import { IPasswordSettings } from '@mp/api/profiles/util';
import * as admin from 'firebase-admin';
import { IRelationship } from '../../util/src/interfaces/relationship.interface';
import { Discipline } from '../../util/src/enums/discipline.enum';
import { IUser } from '@mp/api/users/util';
import { IRelation } from '../../util/src/interfaces/relation.interface';
import { DeleteUsersResult } from 'firebase-admin/auth';

@Injectable()
export class ProfilesRepository {
  async findOne(profile: IProfile) {
    return await admin
      .firestore()
      .collection('profiles')
      .withConverter<IProfile>({
        fromFirestore: (snapshot) => {
          return snapshot.data() as IProfile;
        },
        toFirestore: (it: IProfile) => it,
      })
      .doc(profile.userId)
      .get();
  }

  async createProfile(profile: IProfile) {
    // Remove password field if present
    delete profile.accountDetails?.password;
    return await admin
      .firestore()
      .collection('profiles')
      .doc(profile.userId)
      .create(profile);
  }

  async updateProfile(profile: IProfile) {
    // Remove password field if present
    delete profile.accountDetails?.password;
    return await admin
      .firestore()
      .collection('profiles')
      .doc(profile.userId)
      .set(profile, { merge: true });
  }




  // Pertaining to the settings
  async updatePassword(user : IPasswordSettings) {
    // not doing this
    return Status.SUCCESS;
  }


async updatePrivacySettings(user : IProfile) {
  const userID = user.userId;

  const pstatus = await admin.firestore()
    .collection("profiles")
    .where("userId", "==", userID) 
    .get();
        
    const pdoc = pstatus.docs[0];
    const currentStatus = pdoc?.data()["privacyStatus"];

    if (currentStatus.toLowerCase() == "private") { // Privacy status is Private
      pdoc.ref.update({ newStatus : "public"}).then(() => { // private to public
        return Status.SUCCESS;
      });
    } 
    else { // Privacy status is Public or anything else
      pdoc.ref.update({ newStatus : "private"}).then(() => { // public to private 
        return Status.SUCCESS;
      });
    }
}

async getPrivacySettings(user : IProfile) {
  const userID = user.userId;
  
  const pstatus = await admin.firestore()
    .collection("profiles")
    .where("userId", "==", userID)
    .get();

  const pdoc = pstatus.docs[0];
  const currentStatus = pdoc?.data()["privacyStatus"];

  if (currentStatus.toLowerCase() == "private") {  // if private
    return { status: "private" };
  }
  else { // if public or anything else
    return { status: "public" };
  }

}

async deleteAccount(profile : IProfile) {
  // get userID for convenience
  const userID = profile.userId;

  // User db remove
  const duser = await admin.firestore()
    .collection("users")
    .where("userId", "==", userID)
    .get();

  const currentUser = duser.docs[0];
  await admin.firestore()
    .collection("users")
    .doc(currentUser.id)
    .delete();
  //-------------------------------------
  // Profile db remove
  const dprofile = await admin.firestore()
    .collection("profiles")
    .where("userId", "==", userID)
    .get();

  const currentProfile = dprofile.docs[0];
  await admin.firestore()
    .collection("profiles")
    .doc(currentProfile.id)
    .delete();
  //------------------------------------
  // Posts db remove
  const dposts = await admin.firestore()
    .collection("Posts")
    .where("userId", "==", userID)
    .get();

  for (let j = 0; j != dposts.docs.length; j++) { // calling each instance of post relevant to user
    const currentPost = dposts.docs[j].id;
    await admin.firestore()
      .collection("Posts")
      .doc(currentPost)
      .delete();
  }
}

  async checkRelationship(relationship: IRelationship) {
    const userID = relationship.currentUser?.userId;
    const otherUserID = relationship.otherUser?.userId;

    const documents = await admin.firestore()
    .collection("Profiles")
    .where("userId", "==", userID)
    .get().then((user) => {
      if (user.empty) {
        return {"exists": false, "type": "Not-Friend"}
      } else {

        const userData = user.docs[0].data();
        const friends = userData["accountDetails"]["friends"];
        const blocked = userData["accountDetails"]["blockedUsers"];
        if (otherUserID == undefined){
          return {"exists": false, "type": "Not-Friend"}
        }
        
        if (otherUserID in friends){
          return {"exists": true, "type": "Friend"}
        } else if (otherUserID in blocked) {
          return {"exists": true, "type": "Blocked"}
        } else {
          return {"exists": true, "type": "Not-Friend"}
        }
      }
    }
    );
    
    return {"exists": false, "type": "Not-Friend"}
  }

  async fetchUserPosts(userProfile: IProfile) {
    

    const userID = userProfile.userId;
    const postIDs : string[] = [];
    const postImages = new Map<string, string>();

    const toReturn: { id: string; title: string; author: string; description: string; 
      content: string; time: number; discipline: Discipline; image:string | undefined}[] = [];

    const userPostDocument = await admin.firestore()
    .collection("Posts")
    .where("userId", "==", userID)
    .orderBy("created", "desc")
    .get();
    
    
    
    userPostDocument.forEach((userPost) => {
        const data = userPost.data();
        postIDs.push(data["id"])
      });
  

    const postImageDocument = await admin.firestore()
    .collection("PostPhotos")
    .where("postId", "in", postIDs)
    .get().then((postImageList) =>  {
      postImageList.forEach((postImage) => {
        const data = postImage.data();
        postImages.set(data["postId"], data["image"])
      })
    });

    userPostDocument.forEach((userPost) => {
      const currentDoc = userPost.data();
      const currentDocPostData = currentDoc['postDetails'];
      toReturn.push({
        id: currentDoc['id'],
        title: currentDoc['title'],
        author: userID,  // TODO: Create function to interpret ```currentDoc['author']``` 's userId value and fetch the appropriate user details
        description: currentDocPostData['desc'],
        content: currentDocPostData['content'],
        time: currentDocPostData['timeWatched'],
        discipline: this.interpretDiscipline(currentDocPostData['discipline']),   // TODO - done: Create function to interpret ```currentDocPostData['discipline']``` 's value
        image : postImages.get(currentDoc["id"])
      });
    });

    

    return {
      "postsFound": true, 
      // "list": toReturn.data
      "list": toReturn
    }
  }

  async updateRelation(relation: IRelation) {



    // Change the relation in the db

    // Get succes response from db

    // Return success enum
    return Status.SUCCESS;


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
