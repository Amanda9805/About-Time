import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './search.page';

const routes: Routes = [
    {
        path: '',
        pathMatch:'full',
        component: SearchPage,
        children: [
          {
            path: 'other-user',
            loadChildren: () =>
              import('@mp/app/other-user/feature').then((m) => m.OtherUserModule),
          },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SearchRouting {}
