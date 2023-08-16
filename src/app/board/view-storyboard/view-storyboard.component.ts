import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Container } from 'src/app/interfaces/container';
import { ImagePosition } from 'src/app/interfaces/image-position';
import { StoryBoardService } from 'src/app/services/storyboard-storage.service';

@Component({
  selector: 'app-view-storyboard',
  templateUrl: './view-storyboard.component.html',
  styleUrls: ['./view-storyboard.component.css']
})
export class ViewStoryboardComponent {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('fullscreenContainer') fullscreenContainer: ElementRef;

  activeContainerIndex: number = 0; // Initialize the active container index

  storyboardName: string;
  storyId: string;
  containers: Container[] = [];

  fullscreen: boolean = false;


  constructor(private storyBoardService: StoryBoardService,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.storyId) {
      const storyboard = await this.storyBoardService.getStoryboard(this.storyId);

      console.log('storyboard', storyboard?.containers);

      if (storyboard) {
        this.storyboardName = storyboard.storyName;
        this.containers = storyboard.containers;
      } else {
        console.log("Storyboard could not be created")
      }
    }

    this.activateContainer(this.activeContainerIndex);

  }

  async activateContainer(index: number) {
    this.containers.forEach((container, i) => (container.active = i === index));
  }


  // fullscreen and navigation functions
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.openFullscreen(this.fullscreenContainer.nativeElement);
    }
  }

  openFullscreen(element: any) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.navigateContainers(-1); // Navigate left
    } else if (event.key === 'ArrowRight') {
      this.navigateContainers(1); // Navigate right
    }
  }

  navigateContainers(offset: number) {
    const newIndex = this.activeContainerIndex + offset;
    if (newIndex >= 0 && newIndex < this.containers.length) {
      this.activeContainerIndex = newIndex;
      this.setActiveContainer();
    }
  }

  setActiveContainer() {
    this.containers.forEach((container, i) => (container.active = i === this.activeContainerIndex));
  }

  navigateToContainer(index: number) {
    this.activeContainerIndex = index;
    this.setActiveContainer();
  }


}