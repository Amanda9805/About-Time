import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FilterList, FilterType, TimeModification, UserTimeModification } from '@mp/api/feed/util';
import { Discipline } from '@mp/api/feed/util';
import { IUser } from '@mp/api/users/util';
import { Status } from '@mp/api/feed/util';

// Login details: email: super@super.com

// password: Testing123?

@Injectable()
export class FeedRepository {

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

  async fetchPosts(filters: FilterList) {

    let discipline = "";
    if (filters?.list?.includes(FilterType.ART_FILTER)) {
      discipline = Discipline.ART;
    } else if (filters?.list?.includes(FilterType.FOOD_FILTER)) {
      discipline = Discipline.FOOD;
    } else if (filters?.list?.includes(FilterType.GAMING_FILTER)) {
      discipline = Discipline.GAMING;
    } else if (filters?.list?.includes(FilterType.SPORT_FILTER)) {
      discipline = Discipline.SPORT;
    } else if (filters?.list?.includes(FilterType.SCIENCE_FILTER)) {
      discipline = Discipline.SCIENCE;
    } else if (filters?.list?.includes(FilterType.NEWS_FILTER)) {
      discipline = Discipline.NEWS;
    } else if (filters?.list?.includes(FilterType.TRAVEL_FILTER)) {
      discipline = Discipline.TRAVEL;
    } else if (filters?.list?.includes(FilterType.MUSIC_FILTER)) {
      discipline = Discipline.MUSIC;
    }

    let documents;

    if (filters?.list?.includes(FilterType.MOST_RECENT)) {
      if (discipline) {
        documents = await admin.firestore()
          .collection("Posts")
          .where("discipline", "==", discipline)
          .orderBy("createdTimestamp", "desc")
          .get();
      } else {
        documents = await admin.firestore()
          .collection("Posts")
          .orderBy("createdTimestamp", "desc")
          .get();
      }
    }
    else if (filters?.list?.includes(FilterType.MOST_POPULAR)) {
      if (discipline) {
        documents = await admin.firestore()
          .collection("Posts")
          .where("discipline", "==", discipline)
          .orderBy("timeWatched", "desc")
          .get();
      } else {
        documents = await admin.firestore()
          .collection("Posts")
          .orderBy("timeWatched", "desc")
          .get();
      }
    } else {
      if (discipline) {
        documents = await admin.firestore()
          .collection("Posts")
          .where("discipline", "==", discipline)
          .get();
      } else {
        documents = await admin.firestore()
          .collection("Posts")
          .get();
      }
    }

    console.log(`Documents retrieved: ${documents}`);

    const toReturn: {
      id: string;
      title: string;
      author: string;
      description: string;
      content: string;
      time: number;
      discipline: Discipline;
      image: string | undefined
    }[] = [];

    const postIDs: string[] = [];
    documents.forEach((doc) => {
      const currentDoc = doc.data();
      postIDs.push(
        currentDoc['id'],
      );
    });

    console.log("boo");

    documents.forEach((doc) => {
      const currentDoc = doc.data();
      const currentDocPostData = currentDoc['postDetails'];
      console.log(currentDocPostData['discipline']);
      toReturn.push({
        id: currentDoc['id'],
        title: currentDoc['title'],
        author: currentDoc["userId"],
        description: currentDocPostData['desc'],
        content: currentDocPostData['content'],
        time: currentDoc['timeWatched'],
        discipline: this.interpretDiscipline(currentDocPostData['discipline']),
        image: currentDocPostData['image']
      });
    });
    return { data: toReturn };
  }

  async addTime(timeMode: TimeModification): Promise<Status> {
    // Query the database to add the amount of time to the post

    const postID = timeMode.postID;
    const amount = timeMode.time;

    const post = await admin.firestore()
      .collection("Posts")
      .where("id", "==", postID)
      .get().then((post) => {
        if (post.empty) {
          return Status.FAILURE;
        } else {

          const docPost = post.docs[0];

          docPost.ref.update({ timeWatched: admin.firestore.FieldValue.increment(amount) }).then(() => {
            return Status.SUCCESS;
          }).catch(() => {
            return Status.FAILURE;
          });
          return Status.FAILURE;
        }
      }
      ).catch(() => {
        return Status.FAILURE;
      }).finally(() => {
        return Status.FAILURE;
      })

    return Status.FAILURE;

  }

  async getUserTime(user: IUser) {
    // Query the database to return the amount of time the user has left
    const userID = user.id;
    const documents = await admin.firestore()
      .collection("profiles")
      .where("userId", "==", userID)
      .get();

    const profile = documents.docs[0];
    const time = profile.data()["time"];

    let flag = false;
    if (time > 0) {
      flag = true;
    }

    return { "timeRemaing": flag, "value": time };
  }

  async modifyUserTime(timeMod: UserTimeModification) {
    const userID = timeMod.userID;
    const amount = timeMod.timeValue;

    const document = await admin.firestore()
      .collection("profiles")
      .where("userId", "==", userID)
      .get().then((user) => {
        if (user.empty) {
          return Status.FAILURE;
        } else {

          const docUser = user.docs[0];

          docUser.ref.update({ time: admin.firestore.FieldValue.increment(amount) }).then(() => {
            return Status.SUCCESS;
          }).catch(() => {
            return Status.FAILURE;
          });
          return Status.FAILURE;
        }
      }
      ).catch(() => {
        return Status.FAILURE;
      }).finally(() => {
        return Status.FAILURE;
      })

    return Status.FAILURE;
  }

}
