import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Storyboard } from 'src/app/interfaces/story-board';
import { StoryBoardService } from 'src/app/services/storyboard-storage.service';

@Component({
  selector: 'app-storyboard-form',
  templateUrl: './storyboard-form.component.html',
  styleUrls: ['./storyboard-form.component.css']
})
export class StoryboardFormComponent {

  storyboards: Storyboard[] = [];


  constructor(
    private storyboardStorageService: StoryBoardService,
    private router: Router,
    private authService: AuthenticationService,
  ) { }

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

}

