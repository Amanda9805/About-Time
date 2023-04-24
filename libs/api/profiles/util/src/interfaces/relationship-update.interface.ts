import { RelationEnum } from "../enums/relations.enum";

export interface RelationshipUpdate {
    userID? : string
    otherUserID? : string
    newRelationship?: RelationEnum | null | undefined;
  }