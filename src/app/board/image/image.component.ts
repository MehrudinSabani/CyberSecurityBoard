import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoryBoardService } from 'src/app/services/storyboard-storage.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  @Input() isResizing: boolean;
  @Input() startX: number;
  @Input() startY: number;
  @Input() draggedImagePosition: any;
  @Input() containers: any[];

  @Input() container: any;
  @Input() containerIndex: any;

  // needed for identifying in which storyboard to update the changes
  @Input() storyboardId: string;


  constructor(private storyBoardService: StoryBoardService) { }

  OnInit() {
    console.log("from image", this.container.images)
  }

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

      // Copy the properties of the current ImagePosition to create a new instance
      if (isTextField) {
        this.draggedImagePosition = { ...this.container.textFieldPositions[index] };
      } else {
        this.draggedImagePosition = { ...this.container.imagePositions[index] };
      }

    }
  }


  resizeImage(event: MouseEvent, index: number, isTextField: boolean) {
    if (this.isResizing) {
      const currentElementPosition = isTextField
        ? this.container.textFieldPositions[index]
        : this.container.imagePositions[index];


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


  endResize() {
    this.isResizing = false;
  }
  onDragEnded(event: CdkDragEnd, index: number) {
    const elementRect = event.source.element.nativeElement.getBoundingClientRect();
    const containerRect = event.source.element.nativeElement.parentElement!.getBoundingClientRect();
  
    const x = elementRect.left - containerRect.left;
    const y = elementRect.top - containerRect.top;
  
    const currentImagePosition = this.container.imagePositions[index];
    if (!currentImagePosition) {
      return console.error('No image position found for this index: ', index);
    }
  
    this.container.imagePositions[index] = {
      x, y,
      width: currentImagePosition.width,
      height: currentImagePosition.height
    };
    this.savePosition();
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



