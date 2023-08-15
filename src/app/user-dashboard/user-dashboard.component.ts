import { Component } from '@angular/core';
import { Storyboard } from '../interfaces/story-board';
import { StoryBoardService } from '../services/storyboard-storage.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  storyInfo: Storyboard[];

  // todo: add a real user
  storyboardAuthor: string = 'user';

  constructor(private storyBoardService: StoryBoardService, private userService: AuthenticationService) {

  }

  ngOnInit() {
    this.loadStoryboards();

  }

  async loadStoryboards() {
    const userId = this.userService.getCurrentUserId();
    const storyboards = await this.storyBoardService.getAllStoryboardsByUserId(await userId);
    if (storyboards) {
      this.storyInfo = storyboards.map(storyboard => storyboard);
    }
  }


}
