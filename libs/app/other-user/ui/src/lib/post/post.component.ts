import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ViewPostContentsComponent } from '../../../../../profile/ui/src/view-post-contents/view-post-contents.component';
import { Discipline, Post } from '@mp/api/profiles/util';

@Component({
  selector: 'mp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
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

  async presentModal(post: Post) {
    const modal = await this.modalController.create({
      component: ViewPostContentsComponent,
      componentProps: {post: post}
    });
    return await modal.present();
  }
}
