import { Component, OnInit } from '@angular/core';
import { ContainerStorageService } from '../services/container-storage.service';

@Component({
  selector: 'app-resizable-image',
  templateUrl: './resizable-image.component.html',
  styleUrls: ['./resizable-image.component.scss']
})
export class ResizableImageComponent implements OnInit{

  constructor(private containerService: ContainerStorageService){

  }

  height:any = 0;
  width:any = 0;
  left:any = 0;
  top:any = 0;


   ngOnInit(): void {
    this.containerService.getTestData().then(data => {
      this.height = data.height;
      this.width = data.width;
      this.left = data.left;
      this.top = data.top;
    });

    console.log(this.top)

  
  }





}