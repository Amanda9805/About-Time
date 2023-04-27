import { ProfileImageUpdateRequest } from "../requests";

export class UpdateProfileImageCommand {
    constructor(public readonly request: ProfileImageUpdateRequest) {
        
    }
}