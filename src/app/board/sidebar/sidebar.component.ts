import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageDetail } from 'src/app/interfaces/image-detail';
import { DataStorageService } from 'src/app/services/data-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.onFetchImages();
  }

  characterImages: ImageDetail[] = [];
  symbolImages: ImageDetail[] = [];
  bubbleImages: ImageDetail[] = [];
  backgroundImages: ImageDetail[] = [];


  @Input() draggedImage: string | null = null;
  @Input() draggedImagePosition: { x: number; y: number } | null = null;

  @Output() onDragStartEvent: EventEmitter<{ event: DragEvent; image: string }> = new EventEmitter();

  onDragStart(event: DragEvent, image: string) {
    this.draggedImage = image;
    this.draggedImagePosition = { x: event.clientX, y: event.clientY };
    this.onDragStartEvent.emit({ event, image });
  }


  async onFetchImages() {
    this.characterImages = await this.dataStorageService.fetchImagesByTag('character');
    this.symbolImages = await this.dataStorageService.fetchImagesByTag('symbol');
    this.bubbleImages = await this.dataStorageService.fetchImagesByTag('speech-bubble');
    this.backgroundImages = await this.dataStorageService.fetchImagesByTag('background');
  }


}
