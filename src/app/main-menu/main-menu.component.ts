import { Component } from '@angular/core';
import { Storyboard } from '../interfaces/story-board';
import {  StoryBoardService } from '../services/storyboard-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {


  storyboards: Storyboard[] = [];

  constructor(
    private storyboardStorageService: StoryBoardService,
    private router: Router){}


    createStoryboard() {
      // const placeholderContainer: Container = {
      //   id: 'placeholder',
      //   active: false,
      //   images: {},
      //   imagePositions: { },
      //   textFields: {  },
      //   textFieldPositions: { },
      // };
    
      const newStoryboard: Storyboard = {
        storyName: 'Defense',
        containers: []

        // containers: [placeholderContainer],
      };
      
      this.storyboards.push(newStoryboard);
      this.storyboardStorageService.saveStoryboards(this.storyboards)
      .then((savedStoryboards) => {
        const newStoryboard = savedStoryboards[savedStoryboards.length - 1];
        // console.log(newStoryboard.id);
        this.router.navigate([`/storyboard/new/${newStoryboard.id}`]);
      });
    }
    

}
