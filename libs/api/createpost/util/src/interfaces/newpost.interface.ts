import {IUser} from '@mp/api/users/util';
import { Discipline } from "../enums/discipline.enum"

export interface NewPost {
    title : string;
    author : string;
    description : string;
    content : string;
    discipline : string;
    image : string;
}