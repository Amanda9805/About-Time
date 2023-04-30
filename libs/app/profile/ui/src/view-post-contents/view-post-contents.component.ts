import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Discipline, Post } from '@mp/api/profiles/util';


@Component({
  selector: 'view-post-contents',
  templateUrl: './view-post-contents.component.html',
  styleUrls: ['./view-post-contents.component.scss']
})
export class ViewPostContentsComponent {

  @Input() post: Post = {
    id: '',
    title: '',
    content: '',
    author: '',
    description: '',
    discipline: Discipline.ART,
    time: 0,
    image: '',
  };

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
