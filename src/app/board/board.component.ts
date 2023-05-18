import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { ImageDetail } from '../interfaces/image-detail';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  images = [
    'assets/male.png',
    'assets/female.png',
    'assets/bubble.png'

  ];
  imagePositions: { x: number; y: number; }[] = [];

  containers: any[] = [{ id: 'container0', active: true, images: this.images, imagePositions: this.imagePositions }];



  characterImages: ImageDetail[] = [];
  symbolImages: ImageDetail[] = [];
  bubbleImages: ImageDetail[] = [];
  backgroundImages: ImageDetail[] = [];



  



  draggedImage: string | null = null;
  draggedImagePosition: { x: number; y: number } | null = null;


  xPos:any = [];
  yPos:any = [];

  savedX:any = [] ;
  savedY:any = [];


  @ViewChild('container')
  container!: ElementRef;


  constructor(private dataStorageService: DataStorageService){}

  ngOnInit() {
    const savedContainers = localStorage.getItem('containers');
    if (savedContainers) {
      this.containers = JSON.parse(savedContainers);
    } else {
      localStorage.setItem('containers', JSON.stringify(this.containers));
    }
    this.onLoadPosition();
    this.onFetchImages();
  }
  
  
  addContainer() {
    this.containers.forEach((container) => {
      container.active = false;
    });
    this.containers.push({
      id: `container${this.containers.length}`,
      active: true,
      images: [],
      imagePositions: [],
    });
    localStorage.setItem('containers', JSON.stringify(this.containers));
  }
  
  activateContainer(index: number) {
    this.containers.forEach((container, i) => {
      container.active = i === index;
    });
    localStorage.setItem('containers', JSON.stringify(this.containers));
  }

  async onFetchImages(){
    this.characterImages = await this.dataStorageService.fetchImagesByTag('character');
    this.symbolImages = await this.dataStorageService.fetchImagesByTag('symbol');
    this.bubbleImages = await this.dataStorageService.fetchImagesByTag('speech-bubble');
    this.backgroundImages = await this.dataStorageService.fetchImagesByTag('background');
  }


  
  onDragStart(event: DragEvent, image: string) {
    this.draggedImage = image;
    this.draggedImagePosition = { x: event.clientX, y: event.clientY };
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  // updated for multiple containers
onDrop(event: DragEvent) {
  event.preventDefault();
  const url = this.draggedImage;
  if (url) {
    const activeContainer = this.containers.find(container => container.active);
    if (activeContainer) {
      const containerElement = document.getElementById(activeContainer.id);
      if (containerElement) {
        const x = event.clientX - containerElement.offsetLeft - 50;
        const y = event.clientY - containerElement.offsetTop - 50;
        activeContainer.images.push(url);
        activeContainer.imagePositions.push({ x, y });
        this.draggedImage = null;
        this.draggedImagePosition = null;
        localStorage.setItem('containers', JSON.stringify(this.containers));
      }
    }
  }
}
  

  onDragEnded(event: CdkDragEnd, index: number) {
    let target = event.source.getRootElement();
    let boundingClientRect = target.getBoundingClientRect();
    let container = target.parentElement;
    let parentPosition = this.getPosition(container);
    const x = boundingClientRect.x - parentPosition.left;
    const y = boundingClientRect.y - parentPosition.top;
    const activeContainer = this.containers.find(c => c.active);
    if (activeContainer) {
      activeContainer.imagePositions[index] = { x, y };
      this.savePosition();
    }
  }

  onLoadPosition() {
    this.containers.forEach((container, containerIndex) => {
      container.images.forEach((_: any, i: string | number) => {
        const element = document.querySelector(`#image${containerIndex}_${i}`) as HTMLElement;
        if (element) {
          const boundingClientRect = element.getBoundingClientRect();
          const containerElement = document.querySelector(`#${container.id}`);
          if (!containerElement) {
            console.error('Container element not found');
            return;
          }
          const parentPosition = this.getPosition(containerElement);
          const savedX = container.imagePositions[i].x;
          const savedY = container.imagePositions[i].y;
          element.style.left = (savedX - boundingClientRect.x + parentPosition.left) + 'px';
          element.style.top = (savedY - boundingClientRect.y + parentPosition.top) + 'px';
          container.imagePositions[i] = { x: savedX, y: savedY };
        }
      });
    });
  }


  savePosition() {
    localStorage.setItem('containers', JSON.stringify(this.containers));
  }
  
    getPosition(el: Element | null) {
      let x = 0;
      let y = 0;
      while (el && !isNaN((el as HTMLElement).offsetLeft) && !isNaN((el as HTMLElement).offsetTop)) {
        x += (el as HTMLElement).offsetLeft - (el as HTMLElement).scrollLeft;
        y += (el as HTMLElement).offsetTop - (el as HTMLElement).scrollTop;
        el = (el as HTMLElement).offsetParent;
      }
      return { top: y, left: x };
}}