import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'track',
        loadChildren: () => import('../track/track.module').then(m => m.TrackPageModule)
      },
      {
        path: 'tracks',
        loadChildren: () => import('../tracks/tracks.module').then(m => m.TracksPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/track'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
