import { Discipline } from "../enums/discipline.enum"
import {IUser} from '@mp/api/users/util'; // use existing IUser interface

export interface Post {
    id : string;
    title : string;
    author : string | null;
    description : string;
    content : string;
    discipline : Discipline;
    time : number;
    image : string | undefined;

}