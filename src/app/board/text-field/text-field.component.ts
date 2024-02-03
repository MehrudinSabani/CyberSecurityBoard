import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, HostListener, Input } from '@angular/core';
import { Container } from 'src/app/interfaces/container';
import { ObjectPosition } from 'src/app/interfaces/object-position';
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
  @Input() draggedImagePosition: ObjectPosition;
  @Input() containers: Container[];

  @Input() container: Container;
  @Input() containerIndex: number;

  @Input() storyboardId: string;

  activeTextFieldIndex: number | null = null;

  cdkDragDisabled: boolean = false;

  constructor(private storyBoardService: StoryBoardService) { }


  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
  
    // If there's no active text field, do nothing
    if (this.activeTextFieldIndex === null) return;
  
    const currentElementPosition = this.container.textFieldPositions[this.activeTextFieldIndex];
  
    // Use deltaY to determine the scroll direction
    const delta = event.deltaY;
  
    if (delta < 0) {
      // Increase size
      currentElementPosition.width += 10;
      currentElementPosition.height += 10;
    } else {
      // Decrease size
      currentElementPosition.width = Math.max(10, currentElementPosition.width - 10);
      currentElementPosition.height = Math.max(10, currentElementPosition.height - 10);
    }
  
    // Update the style of the textarea
    const element = document.getElementById(`textField${this.containerIndex}_${this.activeTextFieldIndex}`);
    if (element) {
      element.style.width = `${currentElementPosition.width}px`;
      element.style.height = `${currentElementPosition.height}px`;
    }
  }

  onResizeStart(event: MouseEvent) {
    // Calculate if the mouse is near the bottom-right corner for resizing
    // This is a simplified example, you'll need to adjust the logic here
    const TEXTAREA_RESIZE_HANDLE_SIZE = 20; // Adjust this value based on your design
    const textArea: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
    const { right, bottom } = textArea.getBoundingClientRect();
    if (event.clientX >= right - TEXTAREA_RESIZE_HANDLE_SIZE &&
        event.clientY >= bottom - TEXTAREA_RESIZE_HANDLE_SIZE) {
      this.isResizing = true;
      // Disable dragging
      this.cdkDragDisabled = true;
    }
  }

  onResizeEnd() {
    if (this.isResizing) {
      this.isResizing = false;
      // Re-enable dragging
      this.cdkDragDisabled = false;
    }
  }


  async onTextDragEnd(event: CdkDragEnd, id: string) {
    // Get the new position of the text field
    const elementRect = event.source.element.nativeElement.getBoundingClientRect();
    const containerRect = event.source.element.nativeElement.parentElement!.getBoundingClientRect();
  
    const newX = elementRect.left - containerRect.left;
    const newY = elementRect.top - containerRect.top;
  
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
  
        // Save the updated containerso
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
