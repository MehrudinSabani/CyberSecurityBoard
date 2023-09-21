import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlingService {
  images = [
    'assets/male.png',
    'assets/female.png',
    'assets/bubble.png'
  ];
  imagePositions: { x: number; y: number; }[] = [];

  constructor() {}
  
}
