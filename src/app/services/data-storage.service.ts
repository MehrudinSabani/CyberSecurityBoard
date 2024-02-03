import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor( private firestore: Firestore) { }

  async fetchImagesByTag(tag: String) {
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
  
  // async filterImagesByTag(tag: String, filter: any) {
  //   const imageData: any[] = [];
   
  //   const collectionInstance = collection(this.firestore, 'imageData');
  //   const baseQuery = query(collectionInstance, where('imageTag', '==', tag));
     
  //   const emotionTags = Object.keys(filter).filter(key => key === 'emotionTag' && filter[key]);
  //   const positionTags = Object.keys(filter).filter(key => key === 'positionTag' && filter[key]);
   
  //   const queries = [];
  //   if (emotionTags.length > 0) {
  //      queries.push(query(baseQuery, where('emotionTag', 'in', emotionTags)));
  //   }
  //   if (positionTags.length > 0) {
  //      queries.push(query(baseQuery, where('positionTag', 'in', positionTags)));
  //   }
   
  //   for (let query of queries) {
  //      const querySnapshot = await getDocs(query);
  //      querySnapshot.forEach((doc) => {
  //        const data = doc.data();
  //        imageData.push({ ...data });
  //      });
  //   }
   
  //   return imageData;
  //  }
   
}
