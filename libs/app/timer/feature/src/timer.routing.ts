import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimerComponent } from './timer.component';

const routes: Routes = [
    {
        path: '',
        pathMatch:'full',
        component: TimerComponent,
        children: [
          {
            path: 'death-screen',
            loadChildren: () =>
              import('@mp/app/death-screen/feature').then((m) => m.DeathScreenModule),
          },
        ]
    },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TimerRouting {}
