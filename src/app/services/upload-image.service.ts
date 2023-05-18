import { Injectable } from '@angular/core';
import {DocumentReference,  Firestore, addDoc, collection} from '@angular/fire/firestore';

import { Observable, catchError, from, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(private firestore: Firestore) { }


  storeImage(imageData: any): Observable<DocumentReference<any>> {
    const docRef = collection(this.firestore, 'imageData');
    return from(addDoc(docRef, imageData)).pipe(
      catchError((error) => {
        console.error('Error storing image:', error);
        return throwError(error);
      })
    );
  }
}
