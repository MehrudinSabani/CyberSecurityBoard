import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Container } from 'src/app/interfaces/container';
import { ObjectPosition } from 'src/app/interfaces/object-position';
import { StoryBoardService } from 'src/app/services/storyboard-storage.service';

@Component({
  selector: 'app-view-storyboard',
  templateUrl: './view-storyboard.component.html',
  styleUrls: ['./view-storyboard.component.css']
})
export class ViewStoryboardComponent {
  @ViewChild('container') container!: ElementRef;
  // @ViewChild('fullscreen') fullscreenContainer: ElementRef;

  activeContainerIndex: number = 0; // Initialize the active container index

  storyboardName: string;
  storyId: string;
  containers: Container[] = [];

  fullscreen: boolean = false;

  // for assigning random colors to paths
  pathIdColors: Map<string, string> = new Map();

  predefinedColors: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#800000', '#008000', '#000080', '#808000', '#008080', '#800080', '#000000',
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#C0C0C0', '#808080', '#999999'
  ];

// todo: set active container to be the first in ngoninit
  constructor(private storyBoardService: StoryBoardService,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.storyId) {
      const storyboard = await this.storyBoardService.getStoryboard(this.storyId);

      console.log('storyboard', storyboard?.containers);

      if (storyboard) {
        this.storyboardName = storyboard.storyName;
        this.containers = storyboard.containers;
      } else {
        console.log("Storyboard could not be created")
      }
    }

    // this.activateContainer(this.activeContainerIndex);
  
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('Key pressed', event.key);
    if (event.key === 'ArrowLeft') {
      this.navigateContainers(-1); // Navigate left
    } else if (event.key === 'ArrowRight') {
      this.navigateContainers(1); // Navigate right
    }
  }
  
  //important, user should not be able to navigate using arrows when a choice needs to be made
  navigateContainers(offset: number) {
    console.log('Navigating containers', offset);

    const activeContainer: any = this.containers.find(container => container.active);
    if (!activeContainer) {
      return;
    }

    const activeIndex = this.containers.indexOf(activeContainer);
    const newIndex = activeIndex + offset;

    if (newIndex >= 0 && newIndex < this.containers.length) {
      // If navigating to the right, check if the next container is part of a different storyline
      if (offset > 0 && this.isDifferentStoryline(newIndex)) {
        return;
      }

      this.activeContainerIndex = newIndex;
      this.setActiveContainer();
    }
  }


  isDifferentStoryline(index: number): boolean {
    // If it's out of bounds, stop navigation
    if (index < 0 || index >= this.containers.length) {
      console.log("stop, new storyline");
      return true;
    }
  
    // Check if the pathId of the next container starts with the pathId of the current container
    const currentPathId = this.containers[index - 1].pathId;
    const nextPathId = this.containers[index].pathId;
    return !nextPathId.startsWith(currentPathId);
  }

  setActiveContainer() {
    this.containers.forEach((container, i) => (container.active = i === this.activeContainerIndex));
  }

  async activateContainer(container: Container) {
    // Set active property to false for all containers
    this.containers.forEach((c) => c.active = false);

    // Set active property to true for the clicked container
    container.active = true;
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

  // random colors assigning
  generateRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  getColorForPathId(pathId: string): string {
    // If it's the first path, don't color it
    if (pathId === 'path') {
      return '';
    }
  
    if (!this.pathIdColors.has(pathId)) {
      const color = this.predefinedColors[this.pathIdColors.size % this.predefinedColors.length];
      this.pathIdColors.set(pathId, color);
      localStorage.setItem(pathId, color);
    }
    return this.pathIdColors.get(pathId)!;
  }
  
  
}

