import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthModule } from '@mp/app/auth/data-access';
import { NgxsModule } from "@ngxs/store";
import { CreatePostState } from "./create-post.state";
import { CreatePostApi } from "./create-post.api";
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, NgxsModule.forFeature([CreatePostState]), AuthModule, FormsModule],
    providers: [CreatePostApi]
})

export class CreatePostModule { };