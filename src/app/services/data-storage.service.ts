import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor( private firestore: Firestore) { }


  async fetchImages(){
    const imageData: any[] = [];

    const collectionInstance = collection(this.firestore, 'imageData');
    const q = query(collectionInstance);
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // const imageId = doc.id;
      imageData.push({...data})
    })
    return imageData;
  }


  async fetchImagesByTag(tag: any) {
    const imageData: any[] = [];
  
    const collectionInstance = collection(this.firestore, 'imageData');
    const q = query(collectionInstance, where('imageTag', '==', tag));
    const querySnapshot = await getDocs(q);
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      imageData.push({ ...data });
    });
  
    return imageData;
  }
  
  


}
