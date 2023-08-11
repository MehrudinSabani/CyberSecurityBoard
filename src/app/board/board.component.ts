import { StoryBoardService } from '../services/storyboard-storage.service';
import { ImagePosition } from '../interfaces/image-position';
import { Container } from '../interfaces/container';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Storyboard } from '../interfaces/story-board';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {


  @ViewChild('container') container!: ElementRef;

  // activeContainer: Container;  // Add this line

  storyboardName: string;
  storyId: string;

  containers: Container[] = [];

  draggedImage: string;
  draggedImagePosition: ImagePosition;

  // image resizing
  isResizing = false;
  startX = 0;
  startY = 0;

  constructor(private storyBoardService: StoryBoardService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.storyId) {
      const storyboard = await this.storyBoardService.getStoryboard(this.storyId);

      console.log('storyboard', storyboard?.containers);

      if (storyboard) {
        this.storyboardName = storyboard.storyName;
        this.containers = storyboard.containers;
      } else {

        // todo: this is bad error handling 

        // instead Show error message or redirect to another page

        const newStoryboard: Storyboard = {
          storyName: 'Defense Story',
          containers: this.containers
        };
        await this.storyBoardService.saveStoryboards([newStoryboard]);
      }
    }

  }


  // this is responsible for dropping from sidebar
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
      textFields: {},
      textFieldPositions: {}
    };
    this.containers.push(newContainer);


    const storyboard = await this.storyBoardService.getStoryboard(this.storyId!);
    storyboard!.id = this.storyId!;  // Set the id of the storyboard
    // this is cruicial for updating the existing storyboard, without this new sb gets generated with a different id
    storyboard!.containers = this.containers;
    await this.storyBoardService.saveStoryboards([storyboard!]);


  }


  async activateContainer(index: number) {
    this.containers.forEach((container, i) => (container.active = i === index));
    this.updateElementPositions();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();

    let offsetX = 0, offsetY = 0;

    // this if statment allows to move the input field
    if (event.dataTransfer) {
      const id = event.dataTransfer.getData('text/plain');
      offsetX = parseFloat(event.dataTransfer.getData('text/offset-x'));
      offsetY = parseFloat(event.dataTransfer.getData('text/offset-y'));
      const inputElement = document.getElementById(id);
      if (inputElement) {
        inputElement.style.left = `${event.clientX - offsetX}px`;
        inputElement.style.top = `${event.clientY - offsetY}px`;

        // Find the active container
        const activeContainer = this.containers.find((container) => container.active);

        // Update the textFieldPositions object
        if (activeContainer && activeContainer.textFieldPositions[id]) {
          activeContainer.textFieldPositions[id].x = event.clientX - offsetX;
          activeContainer.textFieldPositions[id].y = event.clientY - offsetY;

          // Get the storyboard id
          const storyboardId = this.route.snapshot.paramMap.get('id');

          // If the storyboard id exists, get the storyboard and update its containers
          if (storyboardId) {
            const storyboard = await this.storyBoardService.getStoryboard(storyboardId);
            storyboard!.containers = this.containers;
            await this.storyBoardService.saveStoryboards([storyboard!]);
          }
        }

        return; // if an input field is dropped, return early to prevent dropping an image
      }
    }

    const url = this.draggedImage;
    if (!url) return;

    const activeContainer = this.containers.find((container) => container.active);

    if (!activeContainer) return;

    const containerElement = document.getElementById(activeContainer.id);
    if (!containerElement) return;

    const x = event.clientX - containerElement.offsetLeft - offsetX;
    const y = event.clientY - containerElement.offsetTop - offsetY;

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
      // Get the storyboard id
      const storyboardId = this.route.snapshot.paramMap.get('id');

      // If the storyboard id exists, get the storyboard and update its containers
      if (storyboardId) {
        const storyboard = await this.storyBoardService.getStoryboard(storyboardId);
        storyboard!.id = storyboardId;
        storyboard!.containers = this.containers;
        await this.storyBoardService.saveStoryboards([storyboard!]);
      }
    }
  }

  updateElementPositions() {

    this.updateImagePositions();
    this.updateTextFieldPositions();

  }

  updateImagePositions() {
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
    });
  }

  updateTextFieldPositions() {
    this.containers.forEach((container, containerIndex) => {
      if (!container.active) return;

      Object.entries(container.textFieldPositions).forEach(([index, position]) => {
        const textFieldElement = document.getElementById(`textField${containerIndex}_${index}`);
        if (!textFieldElement || typeof position !== 'object' || position === null) return;

        const pos = position as ImagePosition;
        textFieldElement.style.left = `${pos.x}px`;
        textFieldElement.style.top = `${pos.y}px`;
        textFieldElement.style.width = `${pos.width}px`;
        textFieldElement.style.height = `${pos.height}px`;
      });
    })
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
      [newIndex]: { x: 50, y: 50, width: 80, height: 40 }
    };

    // Get the storyboard id
    const storyboardId = this.route.snapshot.paramMap.get('id');

    // If the storyboard id exists, get the storyboard and update its containers
    if (storyboardId) {
      const storyboard = await this.storyBoardService.getStoryboard(storyboardId);
      storyboard!.id = storyboardId;
      storyboard!.containers = this.containers;
      await this.storyBoardService.saveStoryboards([storyboard!]);
    }
  }


}