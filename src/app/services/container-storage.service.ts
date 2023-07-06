import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, setDoc } from '@angular/fire/firestore';
import { Container } from '../interfaces/container';

@Injectable({
  providedIn: 'root',
})
export class ContainerStorageService {
  constructor(private firestore: Firestore) {}

  // todo: fix mapping to reduce the firestore complexity
  
  async saveContainers(containers: Container[]) {
    // Convert images, imagePositions, textFields, and textFieldPositions objects to arrays of objects with keys
    const containersForFirestore = containers.map((container) => {
      const imagesArray = Object.entries(container.images).map(([key, value]) => ({ key, value }));
      const imagePositionsArray = Object.entries(container.imagePositions).map(([key, value]) => ({ key, value }));
      const textFieldsArray = Object.entries(container.textFields).map(([key, value]) => ({ key, value }));
      const textFieldPositionsArray = Object.entries(container.textFieldPositions).map(([key, value]) => ({ key, value }));
  
      return {
        ...container,
        images: imagesArray,
        imagePositions: imagePositionsArray,
        textFields: textFieldsArray,
        textFieldPositions: textFieldPositionsArray,
      };
    });
  
    const containersRef = doc(this.firestore, 'containers', 'containersData');
    await setDoc(containersRef, { containers: containersForFirestore });
  }
  

  // Get containers from Firestore
  async getContainers() {
    const containersRef = doc(this.firestore, 'containers', 'containersData');
    const containersDoc = await getDoc(containersRef);
    if (containersDoc.exists()) {
      const containersData = containersDoc.data()['containers'];
  
      // Convert images, imagePositions, textFields, and textFieldPositions arrays of objects with keys back to objects
      const containers = containersData.map((containerData: any) => {
        const images = containerData.images.reduce((acc: { [key: string]: string }, obj: any) => {
          acc[obj.key] = obj.value;
          return acc;
        }, {});
  
        const imagePositions = containerData.imagePositions.reduce(
          (acc: { [key: string]: { x: number; y: number } }, obj: any) => {
            acc[obj.key] = obj.value;
            return acc;
          },
          {}
        );
  
        const textFields = containerData.textFields.reduce((acc: { [key: string]: string }, obj: any) => {
          acc[obj.key] = obj.value;
          return acc;
        }, {});
  
        const textFieldPositions = containerData.textFieldPositions.reduce(
          (acc: { [key: string]: { x: number; y: number } }, obj: any) => {
            acc[obj.key] = obj.value;
            return acc;
          },
          {}
        );
  
        return {
          ...containerData,
          images,
          imagePositions,
          textFields,
          textFieldPositions,
        };
      });
  
      return containers;
    } else {
      return null;
    }
  }
  

  async getTestData(): Promise<{height?: number, width?: number, left?: number, top?: number}>{
    const docRef = doc(this.firestore, 'testData', 'WRYi3BA3VnZXEyU933JK');
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        height: data?.['height'],
        width: data?.['width'],
        left: data?.['left'],
        top: data?.['top'],
      }
    } else {
      console.log("No such document!");
      return {};
    }
  }
  
}
