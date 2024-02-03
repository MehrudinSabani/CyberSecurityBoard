import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ImageDetail } from 'src/app/interfaces/image-detail';
import { DataStorageService } from 'src/app/services/data-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private dataStorageService: DataStorageService) { }

  filteredCharacterImages: ImageDetail[] = [];

  activeTabIndex: number = 0; // Default to the first tab


  async ngOnInit() {
    await this.onFetchImages();  // Fetch images first
    this.filterImages();  // Then apply initial filter
    this.filterForm.valueChanges.subscribe(() => this.filterImages());
  }
  
  // form for the filter
  filterForm = new FormGroup({
    emotionTag: new FormArray([]),
    positionTag: new FormArray([])
  });
  
  characterImages: ImageDetail[] = [];
  symbolImages: ImageDetail[] = [];
  bubbleImages: ImageDetail[] = [];
  backgroundImages: ImageDetail[] = [];

  panelOpenState = false;



  @Input() draggedImage: string | null = null;
  @Input() draggedImagePosition: { x: number; y: number } | null = null;

  @Output() onDragStartEvent: EventEmitter<{ event: DragEvent; image: string }> = new EventEmitter();

  onDragStart(event: DragEvent, image: string) {
    this.draggedImage = image;
    this.draggedImagePosition = { x: event.clientX, y: event.clientY };
    this.onDragStartEvent.emit({ event, image });
  }


  async onFetchImages() {
    this.characterImages  = await this.dataStorageService.fetchImagesByTag('character');
    this.symbolImages     = await this.dataStorageService.fetchImagesByTag('symbol');
    this.bubbleImages     = await this.dataStorageService.fetchImagesByTag('speech-bubble');
    this.backgroundImages = await this.dataStorageService.fetchImagesByTag('background');
    this.filteredCharacterImages = [...this.characterImages]; // Initialize filtered images

  }

  async filterImages() {
    const emotionTags = (this.filterForm.get('emotionTag') as FormArray).value;
    const positionTags = (this.filterForm.get('positionTag') as FormArray).value;
  
    this.filteredCharacterImages = this.characterImages.filter(image => {
      const emotionMatches = emotionTags.length === 0 || emotionTags.includes(image.emotionTag);
      const positionMatches = positionTags.length === 0 || positionTags.includes(image.positionTag);
      return (emotionMatches && positionMatches);
    });
    console.log('Filtered images:', this.filteredCharacterImages);

  }
  
  onCheckboxChange(event: any, controlName: string, value: string) {
    const control = (this.filterForm.get(controlName) as FormArray);
  
    if (event.target.checked) {
      control.push(new FormControl(value));
    } else {
      const index = control.controls.findIndex(x => x.value === value);
      control.removeAt(index);
    }
  }
  
}
