import { Component, Inject } from '@angular/core';
import { Storyboard } from '../interfaces/story-board';
import { StoryBoardService } from '../services/storyboard-storage.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StoryboardFormComponent } from './storyboard-form/storyboard-form.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {



  constructor(
    private router: Router,
    private authService: AuthenticationService,
    public dialog: MatDialog,
  ) { }

  openDialog() {
    if (!this.authService.userLoggedIn) {
      alert('In order to create a storyboard you have to be logged in');
      this.router.navigate([`/login`]);
      return;
    }
    else {
      const dialogRef = this.dialog.open(StoryboardFormComponent);

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
}

