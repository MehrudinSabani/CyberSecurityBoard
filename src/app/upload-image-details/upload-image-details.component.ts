import { Component } from '@angular/core';
import { Storage, ref } from '@angular/fire/storage';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { UploadImageService } from '../services/upload-image.service';

@Component({
  selector: 'app-upload-image-details',
  templateUrl: './upload-image-details.component.html',
  styleUrls: ['./upload-image-details.component.css']
})
export class UploadImageDetailsComponent {
  imageForm: FormGroup;
  uploads: any[]; // an array that holds the uploaded image URLs and refs
  characterChecked: boolean = false;

  constructor(   
     private storage: Storage,
     private uploadImageService: UploadImageService
     ) {}

  ngOnInit(): void {
    this.imageForm = new FormGroup({
      'imageName': new FormControl('', Validators.required),
      'imageTag': new FormControl('', Validators.required),
      'emotionTag': new FormControl('', Validators.required),
      'positionTag': new FormControl('', Validators.required)
    })
  }

  uploadFiles(input: HTMLInputElement) {

    if(!input.files) return;
    const files: FileList = input.files;
    // todo: research Promise
    const uploadPromises: Promise<any>[] = [];

    for (let i = 0; i < files.length; i++){
      const file = files.item(i);
      if(file){
        // todo what is ref?
        // todo place in individual folder depending on the image category, or not?
        const storageRef = ref(this.storage, file.name);
        const uploadPromise = uploadBytesResumable(storageRef, file).then(
          (snapshot) => {
            console.log('uploaded', snapshot.totalBytes, 'bytes');

            return getDownloadURL(snapshot.ref).then((url) => {
              return url;
            }).catch((error) => {
              console.error('upload failed', error);
              throw error
            });
          }
        );
        uploadPromises.push(uploadPromise)
      }
    }


    Promise.all(uploadPromises).then((urls) => {
      const formData = this.imageForm.value;
      // the imageLink property is added, and the name is stored in firebase as defined here
      formData.imageLink = urls;
  
      this.uploadImageService.storeImage(formData).subscribe(
        () => {
        console.log('Form data', formData);
      }, (error) => {
        console.error('Failed to store project', error);
      });
    }).catch((error) => {
      console.error('Failed to upload files', error);
    });
  }

  
  checkCharacter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.characterChecked = target.value === 'character';
    
  }
}
