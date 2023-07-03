import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ContainerStorageService } from '../services/container-storage.service';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}


@Component({
  selector: 'app-resizable-image',
  templateUrl: './resizable-image.component.html',
  styleUrls: ['./resizable-image.component.scss']
})
export class ResizableImageComponent implements OnInit{

  constructor(private containerService: ContainerStorageService){

  }

  src: string = 'https://firebasestorage.googleapis.com/v0/b/cybersecurityboard-a5dc4.appspot.com/o/hacker.png?alt=media&token=cb779fbb-b4d2-4e7e-ba6b-73ff8796b2e4'
  width: number = 120;
  height: number = 100;
  left: number = 100;
  top: number = 50;
  // the reference variable anotated with # is being manipulated (check html)
  @ViewChild("box") public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: Status = Status.OFF;
  private mouseClick: {x: number, y: number, left: number, top: number}

  ngOnInit() {}

  ngAfterViewInit(){
    this.loadBox();
    this.loadContainer();
  }

  private loadBox(){
    const {left, top} = this.box.nativeElement.getBoundingClientRect();
    this.boxPosition = {left, top};
  }

  // properly defining the boundaries and positions relative to the container
  // todo: apply this method to the board component
  private loadContainer(){
    const left = this.boxPosition.left - this.left;
    const top = this.boxPosition.top - this.top;
    const right = left + 600;
    const bottom = top + 450;
    this.containerPos = { left, top, right, bottom };
  }

  setStatus(event: MouseEvent, status: number){
    if(status === 1) event.stopPropagation();
    else if(status === 2) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.left, top: this.top };
    else this.loadBox();
    this.status = status;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: DragEvent){
    this.mouse = { x: event.clientX, y: event.clientY };

    if(this.status === Status.RESIZE) this.resize();
    else if(this.status === Status.MOVE) this.move();
  }

  private resize(){
    if(this.resizeCondMeet()){
      this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
      this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
    }
  }

  private resizeCondMeet(){
    return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);
  }

  private move(){
    if(this.moveCondMeet()){
      this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
      this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
    }
  }

  private moveCondMeet(){
    const offsetLeft = this.mouseClick.x - this.boxPosition.left; 
    const offsetRight = this.width - offsetLeft;  
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.height - offsetTop;
    return (
      this.mouse.x > this.containerPos.left + offsetLeft && 
      this.mouse.x < this.containerPos.right - offsetRight &&
      this.mouse.y > this.containerPos.top + offsetTop &&
      this.mouse.y < this.containerPos.bottom - offsetBottom
      );
  }



  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDragStartEvent(eventData: { event: DragEvent; image: string }) {

    
  }




}