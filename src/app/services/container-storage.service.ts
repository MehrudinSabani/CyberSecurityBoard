import { Injectable } from '@angular/core';

import { Firestore, collection, doc, setDoc, getDoc, getDocs, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContainerStorageService {

  constructor(private firestore: Firestore) { }

  async saveContainers(containers: any[]) {
    const containersRef = doc(this.firestore, 'containers', 'containersData');
    await setDoc(containersRef, { containers });
  }

  // Get containers from Firestore
  async getContainers() {
    const containersRef = doc(this.firestore, 'containers', 'containersData');
    const containersDoc = await getDoc(containersRef);
    if (containersDoc.exists()) {
      return containersDoc.data()['containers'];
    } else {
      return null;
    }
  }

  async getContainerPositions() {
    const containerPositions: any[] = [];
  
    const collectionInstance = collection(this.firestore, 'containerPositions');
    const querySnapshot = await getDocs(collectionInstance);
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      containerPositions.push({...data})
    });
  
    return containerPositions;
  }
  
}
