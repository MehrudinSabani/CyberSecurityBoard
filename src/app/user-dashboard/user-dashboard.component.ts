import { Component } from '@angular/core';
import { Storyboard } from '../interfaces/story-board';
import { StoryBoardService } from '../services/storyboard-storage.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  storyInfo: Storyboard[];

  // todo: add a real user
  storyboardAuthor: string = 'user';

  constructor(private storyBoardService: StoryBoardService, 
    private userService: AuthenticationService,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.loadStoryboards();

    this.storyBoardService.getStoryboards().subscribe(storyboards => {
      this.storyInfo = storyboards;
    });
  }

  async loadStoryboards() {
    const userId = this.userService.getCurrentUserId();
    const storyboards = await this.storyBoardService.getAllStoryboardsByUserId(await userId);
    if (storyboards) {
      this.storyInfo = storyboards.map(storyboard => storyboard);
    }
  }

  async deleteStoryboard(storyboardId: string) {
    try {
      await this.storyBoardService.deleteStoryboard(storyboardId);
      console.log('Storyboard deleted');
      this.openSnackBar('Story deleted successfully');
      this.loadStoryboards();
    } catch (error) {
      console.error('Error deleting storyboard', error);
      this.openSnackBar('Failed to delete story');
    }
  }
  
  
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  


}
