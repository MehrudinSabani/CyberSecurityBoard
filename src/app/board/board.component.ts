import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ContainerStorageService } from '../services/container-storage.service';
import { Container } from '../interfaces/container';


interface Position {
  x: number;
  y: number;
}


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent  {


  imagePositions: { x: number; y: number; }[] = [];

  @ViewChild('container')
  container!: ElementRef;

  containers: Container[] = [
    {
      id: 'container0',
      active: true,
      images: '',
      imagePositions: {},
    },
  ];

  draggedImage: string | null = null;
  draggedImagePosition: { x: number; y: number } | null = null;

  handleDragStartEvent(eventData: { event: DragEvent; image: string }) {
    this.draggedImage = eventData.image;
    this.draggedImagePosition = { x: eventData.event.clientX, y: eventData.event.clientY };
  }

  constructor(private containerStorageService: ContainerStorageService) { }

  async ngOnInit() {
    const containers = await this.containerStorageService.getContainers();
    if (containers) {
      this.containers = containers;
    } else {
      await this.containerStorageService.saveContainers(this.containers);
    }
  }
  
  ngOnChanges() {
    this.updateImagePositions();
  }


  async addContainer() {
    this.containers.forEach((container) => {
      container.active = false;
    });
    // setting the newly added container to the active one
    this.containers.push({
      id: `container${this.containers.length}`,
      active: true,
      images: [],
      imagePositions: [],
    });
    await this.containerStorageService.saveContainers(this.containers); // Save containers to Firestore
  }

  async activateContainer(index: number) {
    this.containers.forEach((container, i) => {
      container.active = i === index;
    });
  }

  // thanks to this function we gather information about the image we are currently dragging
  onDragStart(event: DragEvent, image: string) {
    this.draggedImage = image;
    this.draggedImagePosition = { x: event.clientX, y: event.clientY };
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // updated for multiple containers
  async onDrop(event: DragEvent) {
    event.preventDefault();
    const url = this.draggedImage;
    if (url) {
      const activeContainer = this.containers.find(container => container.active);
      if (activeContainer) {
        const containerElement = document.getElementById(activeContainer.id);
        if (containerElement) {
          const x = event.clientX - containerElement.offsetLeft - 50;
          const y = event.clientY - containerElement.offsetTop - 50;

          // Initialize activeContainer.images and activeContainer.imagePositions as objects if undefined
          if (!activeContainer.images) {
            activeContainer.images = {};
          }
          if (!activeContainer.imagePositions) {
            activeContainer.imagePositions = {};
          }
          const newIndex = Object.keys(activeContainer.images).length.toString();
          activeContainer.images[newIndex] = url;
          activeContainer.imagePositions[newIndex] = { x, y };
          this.draggedImage = null;
          this.draggedImagePosition = null;

          // Check for undefined values before saving to Firestore
          if (Object.values(activeContainer.images).includes(undefined) || Object.values(activeContainer.imagePositions).includes(undefined)) {
            console.error('Error: Undefined values found in container data');
          } else {
            await this.containerStorageService.saveContainers(this.containers);
          }
        }
      }
    }
  }

  async onDragEnded(event: CdkDragEnd, index: number) {
    let target = event.source.element.nativeElement;
    let boundingClientRect = target.getBoundingClientRect();
    let container = target.parentElement;
    let parentPosition = this.getPosition(container);
    const x = boundingClientRect.x - parentPosition.left;
    const y = boundingClientRect.y - parentPosition.top;
    const activeContainer = this.containers.find(c => c.active);
    if (activeContainer) {
      activeContainer.imagePositions[index] = { x, y };
      await this.savePosition();
    }
  }

  updateImagePositions() {
    this.containers.forEach((container, containerIndex) => {
      if (container.active) {
        Object.entries(container.imagePositions).forEach(([index, position]) => {
          const imageElement = document.getElementById(`image${containerIndex}_${index}`);
          if (imageElement && typeof position === 'object' && position !== null) {
            const pos = position as Position; // Cast the position object to the Position interface
            imageElement.style.left = `${pos.x}px`;
            imageElement.style.top = `${pos.y}px`;
          }
        });
      }
    });
  }

  async savePosition() {
    await this.containerStorageService.saveContainers(this.containers); // Save containers to Firestore
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
  }
}