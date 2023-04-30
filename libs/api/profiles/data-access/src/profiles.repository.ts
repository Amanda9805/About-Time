import { IProfile, Post, Status, PrivacyStatus, RelationEnum, ProfileImageUpdate } from '@mp/api/profiles/util';
import { Injectable } from '@nestjs/common';
import { IPasswordSettings } from '@mp/api/profiles/util';
import * as admin from 'firebase-admin';
import { IRelationship } from '@mp/api/profiles/util'
import { Discipline } from '@mp/api/profiles/util'
import { RelationshipUpdate } from '@mp/api/profiles/util';
import { IUser } from '@mp/api/users/util';

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
    return await admin
      .firestore()
      .collection('profiles')
      .doc(profile.userId)
      .create(profile);
  }

  async updateProfile(profile: IProfile) {
    // Remove password field if present
    return await admin
      .firestore()
      .collection('profiles')
      .doc(profile.userId)
      .set(profile, { merge: true });
  }

  // Pertaining to the settings
  // Not super important
  async updatePassword(user: IPasswordSettings) {
    return Status.SUCCESS;
  }

  async updatePrivacySettings(user: IProfile, newPrivacy: PrivacyStatus) {
    const userID = user.userId;

    let isNowPrivate = true;
    if (newPrivacy == PrivacyStatus.PUBLIC) {
      isNowPrivate = false;
    }
    const isPrivate = isNowPrivate;

    const doc = await admin.firestore()
      .collection("profiles")
      .where("userId", "==", userID)
      .get();

    if (doc) {
      const ref = doc.docs[0].data()["accountDetails"];
      const updateRef = ref.update({
        private: isPrivate,
      });

      if (updateRef) {
        return Status.SUCCESS;
      } else {
        return Status.FAILURE;
      }

    } else {
      return Status.FAILURE;
    }

  }

  async getPrivacySettings(user: IProfile) {
    const userID = user.userId;

    const doc = await admin.firestore()
      .collection("profiles")
      .where("userId", "==", userID)
      .get();

    if (doc) {
      const isPrivate = doc.docs[0].data()["accountDetails"]["private"];
      if (isPrivate) {
        return PrivacyStatus.PRIVATE;
      } else {
        return PrivacyStatus.PUBLIC;
      }

    } else {
      return PrivacyStatus.PRIVATE;
    }
  }

  async deleteAccount(profile: IProfile) {
    const userId = profile.userId;
    const profileDB = await admin.firestore().collection("profiles").where("userId", "==", userId).get();
    const userDB = await admin.firestore().collection("users").where("id", "==", userId).get();
    const posts = await admin.firestore().collection("Posts").where("userId", "==", userId).get();


    const batch = admin.firestore().batch();

    profileDB.forEach(doc => {
      batch.delete(doc?.ref);
    })

    userDB.forEach(doc => {
      batch.delete(doc?.ref);
    })

    posts.forEach(doc => {
      batch.delete(doc?.ref);
    })

    await batch.commit();

    admin.auth().deleteUser(userId);

    return Status.SUCCESS;

    // if (ref) {
    //   const delRef = ref.docs[0].ref.delete();


    //   const postsRef = await admin.firestore().collection("profiles")
    //     .where("userId", "==", userId).get();

    //   if (postsRef) {
    //     postsRef.forEach((post) => {
    //       post.ref.delete()
    //     });
    //     return Status.SUCCESS;
    //   } else {
    //     return Status.FAILURE;
    //   }

    // } else {
    //   return Status.FAILURE;
    // }
  }

  async checkRelationship(relationship: IRelationship) {
    const userID = relationship.currentUser?.userId;
    const otherUserID = relationship.otherUser?.userId;

    const documents = await admin.firestore()
      .collection("profiles")
      .where("userId", "==", userID)
      .get();


    if (documents) {
      if (documents.empty) {
        return { "exists": false, "type": "Not-Friend" }
      } else {

        const userData = documents.docs[0].data();
        const friends = userData["accountDetails"]["friends"];
        const blocked = userData["accountDetails"]["blockedUsers"];

        if (otherUserID == undefined) {
          return { "exists": false, "type": "Not-Friend" }
        }

        if (otherUserID in friends) {
          return { "exists": true, "type": "Friend" }
        } else if (otherUserID in blocked) {
          return { "exists": true, "type": "Blocked" }
        } else {
          return { "exists": true, "type": "Not-Friend" }
        }
      }
    } else {
      return { "exists": false, "type": "Not-Friend" }
    }
  }

  async fetchUserPosts(userProfile: IProfile) {
    const userID = userProfile.userId;
    console.log("FUP: userId: " ,userID);
    
    const toReturn: {
      id: string; title: string; author: string; description: string;
      content: string; time: number; discipline: Discipline; image: string | undefined
    }[] = [];
    
    const userPostDocument = await admin.firestore()
    .collection("Posts")
    .where("userId", "==", userID)
    .orderBy("created", "desc")
    .get();
    
    console.log("FUP: userPostDocument: ", userPostDocument);
    
    if (userPostDocument) {
      // console.log("FUP: userPostDocument: " ,userPostDocument);
      userPostDocument.forEach((userPost) => {
        const data = userPost.data();
        console.log("FUP: userPostDocument.userPost.data(): " , data);
        const dataDetails = data["postDetails"]
        toReturn.push({
          id: data['id'],
          title: data['title'],
          author: userID,  // TODO: Create function to interpret ```currentDoc['author']``` 's userId value and fetch the appropriate user details
          description: dataDetails['desc'],
          content: dataDetails['content'],
          time: dataDetails['timeWatched'],
          discipline: this.interpretDiscipline(dataDetails['discipline']),   // TODO - done: Create function to interpret ```currentDocPostData['discipline']``` 's value
          image: dataDetails["image"]
        });
      })
    }

    return {
      "postsFound": true,
      "list": toReturn
    }
  }

  async updateRelation(newRelation: RelationshipUpdate) {

    const userID = newRelation.userID;
    const otherUserID = newRelation.otherUserID;
    const newRel = newRelation.newRelationship;

    // Change the relation in the db

    if (newRel == RelationEnum.FRIEND) {
      const document = await admin.firestore()
        .collection("profiles")
        .where("userId", "==", userID)
        .get();

      if (document) {
        const details = document.docs[0].data()["accountDetails"];

        details.update({
          blockedUsers: admin.firestore.FieldValue.arrayRemove(otherUserID),
          friends: admin.firestore.FieldValue.arrayUnion(otherUserID)
        })

        if (details) {
          return Status.SUCCESS;
        } else {
          return Status.FAILURE;
        }
      } else {
        return Status.FAILURE;
      }
    } else if (newRel == RelationEnum.BLOCKED) {
      const document = await admin.firestore()
        .collection("profiles")
        .where("userId", "==", userID)
        .get();

      if (document) {
        const details = document.docs[0].data()["accountDetails"];

        details.update({
          friends: admin.firestore.FieldValue.arrayRemove(otherUserID),
          blockedUsers: admin.firestore.FieldValue.arrayUnion(otherUserID)
        })

        if (details) {
          return Status.SUCCESS;
        } else {
          return Status.FAILURE;
        }
      } else {
        return Status.FAILURE;
      }
    } else {
      const document = await admin.firestore()
        .collection("profiles")
        .where("userId", "==", userID)
        .get();

      if (document) {
        const details = document.docs[0].data()["accountDetails"];

        details.update({
          blockedUsers: admin.firestore.FieldValue.arrayRemove(otherUserID),
          friends: admin.firestore.FieldValue.arrayRemove(otherUserID)
        })

        if (details) {
          return Status.SUCCESS;
        } else {
          return Status.FAILURE;
        }
      } else {
        return Status.FAILURE;
      }
    }
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

  async fetchProfile(user: IUser): Promise<IProfile> {
    // Use user email to get profile from the db
    const uid = user.id;
    console.log("uid: " + uid);

    const documents = await admin.firestore()
      .collection("profiles")
      .where("userId", "==", uid)
      .get();

    if (documents) {
      if (documents.empty) {
        return { userId: "Profile not found" };
      }
      else {
        const userData = documents.docs[0].data();
        return (userData as IProfile);
      }
    } else {
      return { userId: "Profile not found" };
    }

    //return {
    // userId: user.id,
    //  userId: "test",
    //  accountDetails: {
    //   photoURL: "https://ionicframework.com/docs/img/demos/avatar.svg",
    //   userName: "Test User",
    //    title: "deus",
    //    friends: ["friend1", "friend2"],
    //    friendRequests: ["friendRequest1", "friendRequest2"],
    //    blockedUsers: ["blockedUser1", "blockedUser2"],
    //    meters: [],
    //    badgesReceived: [],
    //   private: false,
    // },
    // time: 9000
    //} as IProfile;

    // return {
    //   userId: user.id,
    // }
  }


  async updateProfileImage(update: ProfileImageUpdate) {
    const userID = update.userId;
    const newURL = update.newImageURL;


    const doc = await admin.firestore()
      .collection("profiles")
      .where("userId", "==", userID)
      .get();

    if (doc) {
      const ref = doc.docs[0].ref;
      const updateRef = ref.update({
        photoURL: newURL,
      });

      if (ref) {
        return Status.SUCCESS;
      } else {
        return Status.FAILURE;
      }

    } else {
      return Status.FAILURE;
    }

  }




}









// email?: string | null | undefined;
//   photoURL?: string | null | undefined;
//   userName?: string | null | undefined;
//   title?: string | null | undefined;
//   friends?: string[] | null | undefined;
//   friendRequests?: string[] | null | undefined;
//   blockedUsers?: string[] | null | undefined;
//   meters?: IMeter[] | null | undefined;
//   badgesReceived?: IBadge[] | null | undefined;
//   private?: boolean | null | undefined;
