import { Component, ElementRef, Input } from '@angular/core';
import { Container } from 'src/app/interfaces/container';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.css']
})
export class FullScreenComponent {



  @Input() container!: Container; // Input property to receive the container data
    @Input() containerIndex!: number; // Input property to receive the container index
    @Input() fullscreenContainer!: ElementRef; // Input property to receive the fullscreenContainer reference



}
