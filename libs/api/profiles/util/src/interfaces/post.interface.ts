// Need to remove this later to avoid duplicate code - already defined in Luke's code


import { Discipline } from "../enums/discipline.enum"
import {IUser} from '@mp/api/users/util'; // use existing IUser interface

export interface Post {
    id : string;
    title : string;
    author : string;
    description : string;
    content : string;
    discipline : Discipline;
    time : number;
    image : string | undefined; // reference to an image stored elsewhere in the database; - not sure yet how this will be stored in the db yet

}