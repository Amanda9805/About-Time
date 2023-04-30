// import { RelationEnum } from "../enums/relations.enum";
import { RelationEnum } from "@mp/api/profiles/util";

export interface IRelation {
  exists?: boolean | null | undefined;
  type?: RelationEnum | null | undefined;
}
