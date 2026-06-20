import { Routes } from '@angular/router';
import { HomeComponent }      from './components/home/home.component';
import { MatchListComponent } from './components/match-list/match-list.component';
import { MatchFormComponent } from './components/match-form/match-form.component';
import { MatchEditComponent } from './components/match-edit/match-edit.component';

export const routes: Routes = [
  { path: '',                component: HomeComponent      },
  { path: 'matches',         component: MatchListComponent },
  { path: 'matches/new',     component: MatchFormComponent },
  { path: 'matches/:id/edit',component: MatchEditComponent },
  { path: '**',              redirectTo: ''                },
];
