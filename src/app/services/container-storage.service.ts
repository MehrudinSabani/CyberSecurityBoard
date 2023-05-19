import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Container } from '../interfaces/container';

@Injectable({
  providedIn: 'root',
})
export class ContainerStorageService {
  constructor(private firestore: Firestore) {}

  // todo: fix mapping to reduce the firestore complexity
  
  async saveContainers(containers: Container[]) {
    // Convert images and imagePositions objects to arrays of objects with keys
    const containersForFirestore = containers.map((container) => {
      const imagesArray = Object.entries(container.images).map(([key, value]) => ({ key, value }));
      const imagePositionsArray = Object.entries(container.imagePositions).map(([key, value]) => ({
        key,
        value,
      }));

      return {
        ...container,
        images: imagesArray,
        imagePositions: imagePositionsArray,
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

      // Convert images and imagePositions arrays of objects with keys back to objects
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

        return {
          ...containerData,
          images,
          imagePositions,
        };
      });

      return containers;
    } else {
      return null;
    }
  }
}
