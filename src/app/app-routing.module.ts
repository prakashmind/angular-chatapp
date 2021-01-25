import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocketComponent } from './components/chat/socket.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: SocketComponent },
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
