import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ImagePosition } from 'src/app/interfaces/image-position';
import { ContainerStorageService } from 'src/app/services/container-storage.service';

interface TextField {
  key: string;
  value: any; // Replace 'any' with the actual type if known
}

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})



export class TextFieldComponent {


  @Input() isResizing: boolean;
  @Input() startX: number;
  @Input() startY: number;
  @Input() draggedImagePosition: any;
  @Input() containers: any[];

  @Input() container: any;
  @Input() containerIndex: any;


  constructor(private containerStorageService: ContainerStorageService) { }


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


  endResize() {
    this.isResizing = false;
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
    console.log("image drag works")
  }


  async savePosition() {
    await this.containerStorageService.saveContainers(this.containers);
  }

  trackByFn(item: any) {
    return item.key;
  }


  // text field specific methods

  onTextDragStart(event: DragEvent, id: string) {
    
    event.dataTransfer?.setData('text/plain', id);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    event.dataTransfer?.setData('text/offset-x', offsetX.toString());
    event.dataTransfer?.setData('text/offset-y', offsetY.toString());
  }


  onTextDragEnd(event: DragEvent, id: string) {
    const textFieldElement = event.target as HTMLElement;
    
    // Get the new position of the text field
    const newX = textFieldElement.offsetLeft;
    const newY = textFieldElement.offsetTop;
    
    // Find the active container
    const activeContainer = this.containers.find((container) => container.active);
    
    // Initialize textFieldPositions[id] if it doesn't exist
    if (activeContainer && !activeContainer.textFieldPositions[id]) {
      activeContainer.textFieldPositions[id] = { x: 0, y: 0, width: 100, height: 100 };
    }
    
  // Extract the original key from id
  const originalKey = id.split('_').pop();

  if (originalKey) {
    // Update the textFieldPositions object
    if (activeContainer && activeContainer.textFieldPositions[originalKey]) {
      activeContainer.textFieldPositions[originalKey].x = newX;
      activeContainer.textFieldPositions[originalKey].y = newY;
    
      console.log("drag works")
      // Save the updated containers
      this.containerStorageService.saveContainers(this.containers);
    }
  } else {
    console.error('Error: originalKey is undefined');
  }
  }
  


}
