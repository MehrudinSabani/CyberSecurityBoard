import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Container } from 'src/app/interfaces/container';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.css']
})
export class FullScreenComponent {

  @ViewChild('fullscreen') fullscreenContainer: ElementRef;


  @Input() container!: Container; // Input property to receive the container data
  @Input() containerIndex!: number; // Input property to receive the container index
  @Input() containers: Container[];


  // needed for syncing the navigation of pathid and index id
  @Output() activeContainerIndexChanged = new EventEmitter<number>();


  getKeys = Object.keys;


  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.openFullscreen(this.fullscreenContainer.nativeElement);
      console.log("fullscreen")
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

  async activateContainer(container: Container) {
    this.containers.forEach((c) => (c.active = c === container));
  }

  getActiveContainer(): Container | undefined {
    return this.containers.find(container => container.active);
  }


  getRadioButtonValue(key: string) {
    const activeContainer = this.getActiveContainer();
    let newActiveContainer: any;
    if (activeContainer) {
      const newPathId = activeContainer.pathId + key;
       newActiveContainer = this.containers.find(container => container.pathId === newPathId);
      if (newActiveContainer) {
        this.activateContainer(newActiveContainer);
      }
    }
    console.log(key)

    if (newActiveContainer) {
      this.activateContainer(newActiveContainer);
      const newActiveContainerIndex = this.containers.indexOf(newActiveContainer);
      this.activeContainerIndexChanged.emit(newActiveContainerIndex);
    }
  }


}
