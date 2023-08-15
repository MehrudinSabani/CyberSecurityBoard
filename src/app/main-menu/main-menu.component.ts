import { Component } from '@angular/core';
import { Storyboard } from '../interfaces/story-board';
import {  StoryBoardService } from '../services/storyboard-storage.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {


  storyboards: Storyboard[] = [];

  constructor(
    private storyboardStorageService: StoryBoardService,
    private router: Router,
    private authService: AuthenticationService,
    ){}

    async createStoryboard(addForm: NgForm) {
      const userId = await this.authService.getCurrentUserId();
      const userName: any = await this.authService.getCurrentUsername();

      const newStoryboard: Storyboard = {
        storyName: addForm.value.storyName,
        storyTopic: addForm.value.storyTopic,
        // todo
        userName: userName,
        userId: userId,
        containers: []
      };
      
      this.storyboards.push(newStoryboard);
      this.storyboardStorageService.saveStoryboards(this.storyboards)
      .then((savedStoryboards) => {
        const newStoryboard = savedStoryboards[savedStoryboards.length - 1];
        this.router.navigate([`/storyboard/edit/${newStoryboard.id}`]);
      });
    
      // Close the modal and reset the form
      document.getElementById('add-storyboard-form')?.click();
      addForm.reset();
    }


    checkLoggedInStatus(){
      if (!this.authService.userLoggedIn) {
        alert('In order to create a storyboard you have to be logged in');
        this.router.navigate([`/login`]);
        // return;
      }
    }
}
