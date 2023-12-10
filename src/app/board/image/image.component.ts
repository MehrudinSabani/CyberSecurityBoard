import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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

  @Input() cdkDragDisabled: boolean;
  @Input() container: any;
  @Input() containerIndex: any;

  // needed for identifying in which storyboard to update the changes
  @Input() storyboardId: string;

  @Output() resizeStart = new EventEmitter<void>();
@Output() resizeEnd = new EventEmitter<void>();


activeImageIndex: number | null = null;

  constructor(private storyBoardService: StoryBoardService) { }

  OnInit() {
    console.log("from image", this.container.images)
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
  
    // If there's no active image, do nothing
    if (this.activeImageIndex === null) return;
  
    const currentElementPosition = this.container.imagePositions[this.activeImageIndex];
  
    // Use the deltaY property to determine whether the user scrolled up or down
    const delta = event.deltaY;
  
    if (delta < 0) {
      // Scrolled up, increase size
      currentElementPosition.width += 10;
      currentElementPosition.height += 10;
    } else {
      // Scrolled down, decrease size
      currentElementPosition.width = Math.max(10, currentElementPosition.width - 10);
      currentElementPosition.height = Math.max(10, currentElementPosition.height - 10);
    }
  
    // Optionally, update the element's style for immediate visual feedback
    const element = event.target as HTMLElement;
    element.style.width = `${currentElementPosition.width}px`;
    element.style.height = `${currentElementPosition.height}px`;
  }
  
  


  // startResize(event: MouseEvent, index: number, isTextField: boolean) {
  //   const element = event.target as HTMLElement;
  //   const elementRect = element.getBoundingClientRect();
  
  //   // Adjust the threshold values as needed
  //   const threshold = 20;
  //   const isWithinThreshold =
  //     event.clientX > elementRect.right - threshold &&
  //     event.clientY > elementRect.bottom - threshold;
  
  //   if (isWithinThreshold && event.buttons === 1) {
  //     this.isResizing = true;
  //     this.startX = elementRect.right - event.clientX; // distance from the right edge of the image to the mouse cursor
  //     this.startY = elementRect.bottom - event.clientY; // distance from the bottom edge of the image to the mouse cursor
  //     this.draggedImagePosition = { ...this.container.imagePositions[index] };
  //   }
  // }
  
  // resizeImage(event: MouseEvent, index: number, isTextField: boolean) {
  //   if (this.isResizing && event.buttons === 1) {
  //     const currentElementPosition = isTextField
  //       ? this.container.textFieldPositions[index]
  //       : this.container.imagePositions[index];
  
  //     // Calculate the new right and bottom styles based on the mouse's current position
  //     const newRight = this.startX - event.clientX;
  //     const newBottom = this.startY - event.clientY;
  
  //     // Optionally, update the element's style for immediate visual feedback
  //     const element = event.target as HTMLElement;
  //     element.style.right = `${newRight}px`;
  //     element.style.bottom = `${newBottom}px`;
  //   }
  // }
  
  

  // endResize(event: MouseEvent) {
  //   if (!event.buttons) {
  //     this.isResizing = false;
  //   }
  //   this.resizeEnd.emit();

  // }

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



