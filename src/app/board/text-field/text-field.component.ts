import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { Container } from 'src/app/interfaces/container';
import { ImagePosition } from 'src/app/interfaces/image-position';
import { StoryBoardService } from 'src/app/services/storyboard-storage.service';


@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})

export class TextFieldComponent {

  @Input() isResizing: boolean;
  @Input() startX: number;
  @Input() startY: number;
  @Input() draggedImagePosition: ImagePosition;
  @Input() containers: Container[];

  @Input() container: Container;
  @Input() containerIndex: number;

  @Input() storyboardId: string;

  constructor(private storyBoardService: StoryBoardService) { }


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




  // text field specific methods

  onTextDragStart(event: DragEvent, id: string) {
    
    event.dataTransfer?.setData('text/plain', id);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    event.dataTransfer?.setData('text/offset-x', offsetX.toString());
    event.dataTransfer?.setData('text/offset-y', offsetY.toString());
  }


  async onTextDragEnd(event: CdkDragEnd, id: string) {
    // Get the new position of the text field
    const { x: newX, y: newY } = event.source._dragRef.getFreeDragPosition();
  
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
  
        // Save the updated containers
        await this.savePosition();
      }
    } else {
      console.error('Error: originalKey is undefined');
    }
  }
  

  
  async savePosition() {
    if (this.storyboardId) {
      const storyboard = await this.storyBoardService.getStoryboard(this.storyboardId);
      storyboard!.id = this.storyboardId;
      storyboard!.containers = this.containers;
      await this.storyBoardService.saveStoryboards([storyboard!]);
    }
  }
  

  trackByFn(item: any) {
    return item.key;
  }

}
