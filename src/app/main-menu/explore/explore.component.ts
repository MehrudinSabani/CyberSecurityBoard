import { Component } from '@angular/core';
import { StoryBoardService } from 'src/app/services/storyboard-storage.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {


  storyBoardName: string[];
  // todo: add a real user
  storyBoardAuthor: string = 'user';


  constructor(storyBoardService: StoryBoardService) {

  }

  ngOnInit() {

    this.loadStoryBoards();
  }

  loadStoryBoards(){


  }



}
