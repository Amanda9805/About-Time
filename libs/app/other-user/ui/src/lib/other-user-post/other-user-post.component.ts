import { Component, Input } from '@angular/core';
import { Discipline, Post } from '@mp/api/profiles/util';

@Component({
  selector: 'mp-other-user-post',
  templateUrl: './other-user-post.component.html',
  styleUrls: ['./other-user-post.component.scss']
})
export class OtherUserPostComponent {
  @Input() post: any = { 
    caption: "", 
    imagePath: ""
  }
}
