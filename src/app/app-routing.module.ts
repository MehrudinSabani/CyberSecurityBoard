import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { BoardComponent } from './board/board.component';
import { UploadImageDetailsComponent } from './upload-image-details/upload-image-details.component';
import { ExploreComponent } from './main-menu/explore/explore.component';
import { LoginComponent } from './header/login/login.component';
import { SignupComponent } from './header/signup/signup.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthGuard } from './authentication/auth.guard';


const routes: Routes = [
  { path: '', component: MainMenuComponent}, 
  { path: 'storyboard', component: BoardComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'dashboard', component: UserDashboardComponent, canActivate : [AuthGuard]},

  { path: 'upload', component: UploadImageDetailsComponent}, 
  { path: 'storyboard', component: MainMenuComponent},
  { path: 'storyboard/edit/:id', component: BoardComponent, canActivate : [AuthGuard]},
  { path: 'storyboard/explore', component: ExploreComponent}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
