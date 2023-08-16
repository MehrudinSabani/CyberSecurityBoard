import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../authentication/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {


  
  uuid: string;
  username: string | null;



  constructor(public afAuth: AngularFireAuth, private authService: AuthenticationService) { }
  
  ngOnInit(): void {

    // it has to be called in order to be visible
    this.getUserId();
    this.getUserName();
  }


  logout(): void {
    this.afAuth.signOut();
}

async getUserId(){
  this.uuid = await this.authService.getCurrentUserId();
}

async getUserName(){
  this.username = await this.authService.getCurrentUsername();
}




collapse = false;


toggleSidebar() {
  this.collapse = !this.collapse;
}

}
