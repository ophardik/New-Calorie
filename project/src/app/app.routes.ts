import { Routes } from '@angular/router';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { UserListComponent } from './pages/user-list/user-list.component';

export const routes: Routes = [
    { path: 'user-data/:id', component: UserDataComponent },
    {path:'user-list',component:UserListComponent}
];
