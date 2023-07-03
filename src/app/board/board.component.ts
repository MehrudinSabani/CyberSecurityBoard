import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContainerStorageService } from '../services/container-storage.service';
import { ImagePosition } from '../interfaces/image-position';

interface Container {
  id: string;
  active: boolean;
  images: { [key: string]: string };
  imagePositions: { [key: string]: ImagePosition };
  textFields: { [key: string]: string };
  textFieldPositions: { [key: string]: ImagePosition };
}



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {

  imagePositions: ImagePosition[] = [];
  @ViewChild('container') container!: ElementRef;

  activeContainer: Container;  // Add this line

  containers: Container[] = [];

  draggedImage: string;
  draggedImagePosition: ImagePosition;

  constructor(private containerStorageService: ContainerStorageService) { }

  async ngOnInit() {
    const containers = await this.containerStorageService.getContainers();
    if (containers) {
      this.containers = containers;
    } else {
      await this.containerStorageService.saveContainers(this.containers);
    }
  }

  handleDragStartEvent(eventData: { event: DragEvent; image: string }) {
    this.draggedImage = eventData.image;
    
    const activeContainer = this.containers.find((container) => container.active);
    if (activeContainer) {
      // Iterate over the keys
      const imageKey = Object.keys(activeContainer.images)
        .find(key => activeContainer.images[key] === this.draggedImage);
      if (imageKey) {
        // Get the image position using the key
        const imagePosition = activeContainer.imagePositions[imageKey];
        // Store the current dimensions of the image
        this.draggedImagePosition = { 
          x: eventData.event.clientX, 
          y: eventData.event.clientY, 
          width: imagePosition.width, 
          height: imagePosition.height 
        };
      }
    }
  }
  
  
  async addContainer() {
    this.containers.forEach((container) => (container.active = false));
    const newContainer: Container = {
      id: `container${this.containers.length}`,
      active: true,
      images: {},
      imagePositions: {},
      textFields:{},
      textFieldPositions: {}
    };
    this.containers.push(newContainer);
    await this.containerStorageService.saveContainers(this.containers);
  }

  async activateContainer(index: number) {
    this.containers.forEach((container, i) => (container.active = i === index));
  }

  onDragStart(event: DragEvent, id: string) {
    event.dataTransfer?.setData('text/plain', id);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.preventDefault();
    if (event.dataTransfer) {
      const id = event.dataTransfer.getData('text/plain');
      const inputElement = document.getElementById(id);
      if (inputElement) {
        inputElement.style.left = `${event.clientX}px`;
        inputElement.style.top = `${event.clientY}px`;
      }
    }
    const url = this.draggedImage;
    if (!url) return;

    const activeContainer = this.containers.find((container) => container.active);
    if (!activeContainer) return;

    const containerElement = document.getElementById(activeContainer.id);
    if (!containerElement) return;

    const x = event.clientX - containerElement.offsetLeft - 40;
    const y = event.clientY - containerElement.offsetTop - 40;

    const newIndex = Object.keys(activeContainer.images).length.toString();

    activeContainer.images[newIndex] = url;
    // Set the dimensions to the stored values
    activeContainer.imagePositions[newIndex] = { 
      x, y, 
      width: 100,
      height: 100,
    };

    if (
      Object.keys(activeContainer.images).some((key) => activeContainer.images[key] === undefined) ||
      Object.keys(activeContainer.imagePositions).some((key) => activeContainer.imagePositions[key] === undefined)
    ) {
      console.error('Error: Undefined values found in container data');
    } else {
      await this.containerStorageService.saveContainers(this.containers);
    }

  }

  async onDragEnded(event: CdkDragEnd, index: number) {
    const x = event.source._dragRef.getFreeDragPosition().x;
    const y = event.source._dragRef.getFreeDragPosition().y;
  
    const activeContainer = this.containers.find((container) => container.active);
    if (!activeContainer) return;
  
    const currentImagePosition = activeContainer.imagePositions[index];
    if (!currentImagePosition) {
      return console.error('No image position found for this index: ', index);
    }
    
    activeContainer.imagePositions[index] = { 
      x, y, 
      width: currentImagePosition.width, 
      height: currentImagePosition.height 
    };
    await this.savePosition();
  }
  

  // updateImagePositions() {
  //   this.containers.forEach((container, containerIndex) => {
  //     if (!container.active) return;

  //     Object.entries(container.imagePositions).forEach(([index, position]) => {
  //       const imageElement = document.getElementById(`image${containerIndex}_${index}`);
  //       if (!imageElement || typeof position !== 'object' || position === null) return;

  //       const pos = position as ImagePosition;
  //       imageElement.style.left = `${pos.x}px`;
  //       imageElement.style.top = `${pos.y}px`;
  //       imageElement.style.width = `${pos.width}px`;
  //       imageElement.style.height = `${pos.height}px`;
  //     });
  //   });
  // }
  
  updateElementPositions() {
    this.containers.forEach((container, containerIndex) => {
      if (!container.active) return;
  
      Object.entries(container.imagePositions).forEach(([index, position]) => {
        const imageElement = document.getElementById(`image${containerIndex}_${index}`);
        if (!imageElement || typeof position !== 'object' || position === null) return;
  
        const pos = position as ImagePosition;
        imageElement.style.left = `${pos.x}px`;
        imageElement.style.top = `${pos.y}px`;
        imageElement.style.width = `${pos.width}px`;
        imageElement.style.height = `${pos.height}px`;
      });
  
      Object.entries(container.textFieldPositions).forEach(([index, position]) => {
        const textFieldElement = document.getElementById(`textField${containerIndex}_${index}`);
        if (!textFieldElement || typeof position !== 'object' || position === null) return;
  
        const pos = position as ImagePosition;
        textFieldElement.style.left = `${pos.x}px`;
        textFieldElement.style.top = `${pos.y}px`;
        textFieldElement.style.width = `${pos.width}px`;
        textFieldElement.style.height = `${pos.height}px`;
      });
    });
  }
  

  async savePosition() {
    await this.containerStorageService.saveContainers(this.containers);
  }

  // image resizing
  isResizing = false;
startX = 0;
startY = 0;

startResize(event: MouseEvent, index: number, isTextField: boolean) {
  const element = event.target as HTMLElement;
  const elementRect = element.getBoundingClientRect();

  // Adjust the threshold values as needed
  const threshold = 20;
  const isWithinThreshold =
    event.clientX > elementRect.right - threshold &&
    event.clientY > elementRect.bottom - threshold;

  if (isWithinThreshold) {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    const activeContainer = this.containers.find((container) => container.active);
    if (activeContainer) {
      // Copy the properties of the current ImagePosition to create a new instance
      const currentElementPosition = isTextField
        ? activeContainer.textFieldPositions[index]
        : activeContainer.imagePositions[index];
        
      this.draggedImagePosition = { 
        x: currentElementPosition.x, 
        y: currentElementPosition.y, 
        width: currentElementPosition.width, 
        height: currentElementPosition.height 
      };
    }
  }
}


resizeImage(event: MouseEvent, index: number, isTextField: boolean) {
  if (this.isResizing) {
    const activeContainer = this.containers.find((container) => container.active);
    if (activeContainer) {
      const currentElementPosition = isTextField
        ? activeContainer.textFieldPositions[index]
        : activeContainer.imagePositions[index];
      
      // Calculate the new width and height based on the mouse's current position
      const newWidth = this.draggedImagePosition.width + event.clientX - this.startX;
      const newHeight = this.draggedImagePosition.height + event.clientY - this.startY;

      // Update the width and height of the current ImagePosition
      currentElementPosition.width = newWidth;
      currentElementPosition.height = newHeight;
      
      // Optionally, update the element's style for immediate visual feedback
      const element = event.target as HTMLElement;
      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
    }
  }
}


endResize(event: MouseEvent, index: number) {
  this.isResizing = false;
}

// adding text
async addTextField() {
  const activeContainer = this.containers.find((container) => container.active);
  if (!activeContainer) return;

  const newIndex = Object.keys(activeContainer.textFields).length.toString();

  // Create a new object for textFields with the new key-value pair
  activeContainer.textFields = {
    ...activeContainer.textFields,
    [newIndex]: ''
  };

  // Create a new object for textFieldPositions with the new key-value pair
  activeContainer.textFieldPositions = {
    ...activeContainer.textFieldPositions,
    [newIndex]: { x: 50, y: 50, width: 100, height: 50 }
  };

  await this.containerStorageService.saveContainers(this.containers);
}




}