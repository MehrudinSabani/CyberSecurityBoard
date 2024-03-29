import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
}
