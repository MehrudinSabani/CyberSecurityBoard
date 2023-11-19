import { StoryBoardService } from '../services/storyboard-storage.service';
import { ObjectPosition } from '../interfaces/object-position';
import { Container } from '../interfaces/container';
import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],

})

export class BoardComponent implements OnInit{

  getKeys = Object.keys;

  // todo: add a buffer icon until the story is fully loaded
  // todo: save storyboards only once, with a button "save and publish"

  @ViewChild('container') container!: ElementRef;

  storyboardName: string;
  storyId: string;

  containers: Container[] = [];

  draggedImage: string;
  draggedImagePosition: ObjectPosition;

  // image resizing
  isResizing = false;
  startX = 0;
  startY = 0;

  dragging: boolean = false;

  constructor(private storyBoardService: StoryBoardService, 
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef) { }

  async ngOnInit() {

    this.storyId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.storyId) {
      const storyboard = await this.storyBoardService.getStoryboard(this.storyId);

      console.log('storyboard', storyboard?.containers);

      if (storyboard) {
        this.storyboardName = storyboard.storyName;
        this.containers = storyboard.containers;
      } else {

        // todo: additional measures for error handling
        // instead Show error message or redirect to another page
        console.log("Storyboard could not be created")
      }
    }

    if (this.containers.length === 0) {
      this.addContainer();
    }

    this.handleStoryboardOperations(this.storyId, this.containers);
  }

  getFlattenedContainers() {
    let groupedContainers = this.groupContainers();
    
    // flatten the grouped containers into a single array
    let flattenedContainers = ([] as Container[]).concat(...(Object.values(groupedContainers) as Container[][]));
    
    // sort the containers by pathId
    flattenedContainers.sort((a, b) => a.pathId.localeCompare(b.pathId));
    
    return flattenedContainers;
  }
  
  groupContainers() {
    let groupedContainers: any = {};
    
    this.containers.forEach(container => {
      let parentId = container.pathId.slice(0, -1);
      if (!groupedContainers[parentId]) {
        groupedContainers[parentId] = [];
      }
      groupedContainers[parentId].push(container);
    });
  
    return groupedContainers;
  }

  // todo:add a plus symbol in the middle and triger this function only once
  // solution check if there are any containers, if none - create one
  async addContainer() {
    this.containers.forEach((container) => (container.active = false));
    const newContainer: Container = {
      id: `container${this.containers.length}`,
      active: true,
      images: {},
      imagePositions: {},
      textFields: {},
      textFieldPositions: {},
      pathId: 'path'
      };
    this.containers.push(newContainer);
  
    const storyboard = await this.storyBoardService.getStoryboard(this.storyId!);
    storyboard!.id = this.storyId!;
    storyboard!.containers = this.containers;

    const storyboardId = this.route.snapshot.paramMap.get('id');

    this.handleStoryboardOperations(storyboardId!, this.containers);  }
  

  async activateContainer(container: Container) {
    if (container.active) return;
    // Set active property to false for all containers
    this.containers.forEach((c) => c.active = false);
  
    // Set active property to true for the clicked container
    container.active = true;
  
    // Manually trigger change detection
    this.cd.detectChanges();
  
    // Now call updateElementPositions
    this.updateElementPositions();
  }
  
  getActiveContainer(): Container | undefined {
    return this.containers.find(container => container.active);
  }
  
  
  getRadioButtonValue(key: string) {
    const activeContainer = this.getActiveContainer();
    if (activeContainer) {
      const newPathId = activeContainer.pathId + key;
      const newActiveContainer = this.containers.find(container => container.pathId === newPathId);
      if (newActiveContainer) {
        this.activateContainer(newActiveContainer);
      }
    }
  }

  async continueStoryPath() {
    const activeContainer = this.containers.find(container => container.active);
    if (!activeContainer) return;
    const activeIndex = this.containers.indexOf(activeContainer);
  
    const newContainer: Container = {
      id: `container${this.containers.length}`,
      active: false,
      images: {},
      imagePositions: {},
      textFields: {}, // Initialize textFields as an empty object for the new container
      textFieldPositions: {}, // Initialize textFieldPositions as an empty object for the new container
      radioButtons: {}, // Initialize radioButtons as an empty object for the new container
      pathId: activeContainer.pathId, // Use the same pathId as the active container
    };
  
    // Insert new container at the correct index
    this.containers.splice(activeIndex + 1, 0, newContainer);
    const storyboard = await this.storyBoardService.getStoryboard(this.storyId!);
    storyboard!.id = this.storyId!;
    storyboard!.containers = this.containers;
  }
  
  async splitStoryPath(n: number) {
    const activeContainer = this.containers.find(container => container.active);
    if (!activeContainer) return;
    const activeIndex = this.containers.indexOf(activeContainer);
    const pathIds = Array.from({ length: n }, (_, i) => activeContainer.pathId + String.fromCharCode(97 + i));
    const newContainers: Container[] = pathIds.map(pathId => ({
      id: `container${this.containers.length}`,
      active: false,
      images: {},
      imagePositions: {},
      textFields: {}, // Initialize textFields as an empty object for each new container
      textFieldPositions: {}, // Initialize textFieldPositions as an empty object for each new container
      radioButtons: {}, // Initialize radioButtons as an empty object for each new container
      pathDescription: {},
      pathId,
    }));
  
    // Generate n text fields and radio buttons for the active container
// Generate n text fields and radio buttons for the active container
for (let i = 0; i < n; i++) {
  const newPathId = String.fromCharCode(97 + i);
  
  // Create a new object for textFields with the new key-value pair for the active container
  activeContainer.pathDescription = {
    ...activeContainer.pathDescription,
    [newPathId]: { text: ''}
  };

  // Create a new object for radioButtons with the new key-value pair for the active container
  activeContainer.radioButtons = {
    ...activeContainer.radioButtons,
    [newPathId]: false
  };
}

    // Insert new containers at the correct index
    this.containers.splice(activeIndex + 1, 0, ...newContainers);
    const storyboard = await this.storyBoardService.getStoryboard(this.storyId!);
    storyboard!.id = this.storyId!;
    storyboard!.containers = this.containers;

    this.updateElementPositions();
    // await this.storyBoardService.saveStoryboards([storyboard!]);
  }
  
  splitStoryPathPrompt() {
    const userInput = prompt('Enter the number of paths to split');
    const numberOfPaths = parseInt(userInput!, 10);
    if (!isNaN(numberOfPaths)) {
      this.splitStoryPath(numberOfPaths);
    }
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    const url = this.draggedImage;
    if (!url) return;
    const activeContainer = this.containers.find((container) => container.active);
    if (!activeContainer) return;
    const containerElement = document.getElementById(activeContainer.id);
    if (!containerElement) return;
  
    const x = event.offsetX;
    const y = event.offsetY;
  
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
  
      this.handleDropDownOperations(storyboardId!, this.containers, newIndex);
    }
  }
  
  updateSingleElementPosition(droppedElementIndex: string) {
    const activeContainer = this.containers.find(container => container.active);
    if (!activeContainer) return;
  
    // Compute the ID of the dropped element
    const droppedElementId = `image${this.containers.indexOf(activeContainer)}_${droppedElementIndex}`;
  
    // Find the corresponding position
    const pos = activeContainer.imagePositions[droppedElementIndex];
    if (!pos) return;
  
    // Find the imageElement and update its position
    const imageElement = document.getElementById(droppedElementId);
    if (imageElement) {
      imageElement.style.left = `${pos.x}px`;
      imageElement.style.top = `${pos.y-130}px`;
      imageElement.style.width = `${pos.width}px`;
      imageElement.style.height = `${pos.height}px`;
    }
  }
  

  updateElementPositions() {
    this.containers.forEach((container, containerIndex) => {
      if (!container.active) return;
  
      const positions: { [elementId: string]: ObjectPosition } = {};
  
      Object.entries(container.imagePositions).forEach(([index, position]) => {
        const imageElement = document.getElementById(`image${containerIndex}_${index}`);
        if (!imageElement || typeof position !== 'object' || position === null) return;
  
        const pos = position as ObjectPosition;
        imageElement.style.left = `${pos.x}px`;
        imageElement.style.top = `${pos.y-130}px`;
        imageElement.style.width = `${pos.width}px`;
        imageElement.style.height = `${pos.height}px`;
  
        positions[`image${containerIndex}_${index}`] = pos;
      });
  
      Object.entries(container.textFieldPositions).forEach(([index, position]) => {
        const textFieldElement = document.getElementById(`textField${containerIndex}_${index}`);
        if (!textFieldElement || typeof position !== 'object' || position === null) return;
  
        const pos = position as ObjectPosition;
        textFieldElement.style.left = `${pos.x}px`;
        textFieldElement.style.top = `${pos.y-130}px`;
        textFieldElement.style.width = `${pos.width}px`;
        textFieldElement.style.height = `${pos.height}px`;
  
        positions[`image${containerIndex}_${index}`] = pos;
      });  
      // this.positionService.savePositions(container.id, positions);
    });
  }
  // adding text
  async addTextField() {
    const activeContainer = this.containers.find((container) => container.active);
    if (!activeContainer) return;

    const newIndex = Object.keys(activeContainer.textFields).length.toString();

    // Create a new object for textFields with the new key-value pair
    activeContainer.textFields = {
      ...activeContainer.textFields,
      [newIndex]: { text: '', class: '' }
    };

    // Create a new object for textFieldPositions with the new key-value pair
    activeContainer.textFieldPositions = {
      ...activeContainer.textFieldPositions,
      [newIndex]: { x: 50, y: 50, width: 80, height: 40 }
    };

  }

  async addHeaderField() {
    const activeContainer = this.containers.find((container) => container.active);
    if (!activeContainer) return;
    const newIndex = Object.keys(activeContainer.textFields).length.toString();

    activeContainer.textFields[newIndex] = {
     text: ''
    };

    // Create a new object for textFieldPositions with the new key-value pair
    activeContainer.textFieldPositions = {
      ...activeContainer.textFieldPositions,
      [newIndex]: { x: 50, y: 50, width: 80, height: 40, class: 'headerText' }
    };
  
    // Get the storyboard id
    const storyboardId = this.route.snapshot.paramMap.get('id');
  
    this.handleStoryboardOperations(storyboardId!, this.containers);
  }
  
// sidebar menu functions
  onDragOver(event: DragEvent) {
    event.preventDefault();
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
  saveAndPublishStory() {
    const storyboardId = this.route.snapshot.paramMap.get('id');
    const modifiedUrl = this.router.url.replace('/edit/', '/view/');
    this.router.navigateByUrl(modifiedUrl);
  }

  // todo replace the repetitive code with this helper function
  async handleDropDownOperations(storyboardId: string, containers: Container[], droppedElementIndex: string) {
    if (storyboardId) {
      const storyboard = await this.storyBoardService.getStoryboard(storyboardId);
      storyboard!.id = storyboardId;
      storyboard!.containers = containers;
      await this.storyBoardService.saveStoryboards([storyboard!]);
      this.updateSingleElementPosition(droppedElementIndex);
    }
  }

  async handleStoryboardOperations(storyboardId: string, containers: Container[]) {
    if (storyboardId) {
      const storyboard = await this.storyBoardService.getStoryboard(storyboardId);
      storyboard!.id = storyboardId;
      storyboard!.containers = containers;
      await this.storyBoardService.saveStoryboards([storyboard!]);
      this.updateElementPositions();
    }
  }

  trackByFn(index: number, container: Container) {
    return container.id; // Use the 'id' property as the unique identifier
  }
  
}