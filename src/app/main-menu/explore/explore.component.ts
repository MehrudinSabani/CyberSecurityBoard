import { Component } from '@angular/core';
import { Storyboard } from 'src/app/interfaces/story-board';
import { StoryBoardService } from 'src/app/services/storyboard-storage.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {


  storyInfo: Storyboard[];

  // todo: add a real user
  storyboardAuthor: string = 'user';

  constructor(private storyBoardService: StoryBoardService) {

  }

  ngOnInit() {
    this.loadStoryboards();

  }

  async loadStoryboards() {
    const storyboards = await this.storyBoardService.getAllStoryboards();
    if (storyboards) {
      this.storyInfo = storyboards.map(storyboard => storyboard);
    }
  }



}
