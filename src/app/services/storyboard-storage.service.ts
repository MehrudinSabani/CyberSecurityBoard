import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Container } from '../interfaces/container';
import { Storyboard } from '../interfaces/story-board';
import { AuthenticationService } from '../authentication/authentication.service';
import { TextField } from '../interfaces/text-field';

@Injectable({
  providedIn: 'root',
})
export class StoryBoardService {
  constructor(private firestore: Firestore, private authService: AuthenticationService) { }

  async saveStoryboards(storyboards: Storyboard[]) {
    const storyboardsForFirestore = storyboards.map((storyboard) => {
        const containersForFirestore = storyboard.containers.map((container) => {
          const imagesArray = Object.entries(container.images).map(([key, value]) => ({ key, value }));
          const imagePositionsArray = Object.entries(container.imagePositions).map(([key, value]) => ({ key, value }));
          const textFieldsArray = Object.entries(container.textFields).map(([key, value]) => ({ key, value }));
          const textFieldPositionsArray = Object.entries(container.textFieldPositions).map(([key, value]) => ({ key, value }));
          // const radioButtonArray = Object.entries(container.radioButtons).map(([key,value]) => ({key, value}));  
          const pathDescriptionArray = Object.entries(container.pathDescription).map(([key, value]) => ({ key, value }));
   
            return {
                ...container,
                images: imagesArray,
                imagePositions: imagePositionsArray,
                textFields: textFieldsArray,
                textFieldPositions: textFieldPositionsArray,
                // radioButton: radioButtonArray
                pathDescription: pathDescriptionArray

            };
        });

        return {
            ...storyboard,
            containers: containersForFirestore
        };
    });

    const storyboardsRef = collection(this.firestore, 'storyboards');
    const newStoryboards = [];
    for (const storyboard of storyboardsForFirestore) {
        if (storyboard.id) {
            const docRef = doc(storyboardsRef, storyboard.id);
            await updateDoc(docRef, storyboard);
            newStoryboards.push(storyboard);
        } else {
            const docRef = await addDoc(storyboardsRef, storyboard);
            newStoryboards.push({ ...storyboard, id: docRef.id });
        }
    }

    return newStoryboards;
}





  // todo get storyboard by storyboard id
  async getStoryboard(storyboardId: string): Promise<Storyboard | null> {
    const storyboardRef = doc(this.firestore, 'storyboards', storyboardId);
    const storyboardDoc = await getDoc(storyboardRef);
  
    if (storyboardDoc.exists()) {
      const storyboardData = storyboardDoc.data();
      const containersData = storyboardData['containers'];
  
      const containers: Container[] = containersData.map((containerData: Container) => {
        const imagesArray = Object.entries(containerData.images).map(([key, value]) => ({ key, value }));
        const imagePositionsArray = Object.entries(containerData.imagePositions).map(([key, value]) => ({ key, value }));
        
        // Get text values from database
        const textFieldsArray = Object.entries(containerData.textFields).map(([key, value]) => ({ key, value }));
        const textFieldPositionsArray = Object.entries(containerData.textFieldPositions).map(([key, value]) => ({ key, value }));
  
        const pathDescriptionArray = Object.entries(containerData.pathDescription).map(([key, value]) => ({ key, value }));

        const images = imagesArray.reduce((acc: { [key: string]: string }, obj: any) => {
          acc[obj.key] = obj.value.value;
          return acc;
        }, {});
  
        const imagePositions = imagePositionsArray.reduce(
          (acc: { [key: string]: { x: number; y: number, width: number, height: number } }, obj: any) => {
            acc[obj.key] = obj.value.value;
            return acc;
          },
          {}
        );
  
        const textFields = textFieldsArray.reduce((acc: { [key: string]: string }, obj: any) => {
          acc[obj.key] = obj.value.value;
          return acc;
        }, {});
  
        const textFieldPositions = textFieldPositionsArray.reduce(
          (acc: { [key: string]: { x: number; y: number, width: number, height: number } }, obj: any) => {
            acc[obj.key] = obj.value.value;
            return acc;
          },
          {}
        );

        const pathDescription = pathDescriptionArray.reduce((acc: { [key: string]: string }, obj: any) => {
          acc[obj.key] = obj.value.value;
          return acc;
        }, {});
        const radioButtons = containerData.radioButtons || {}; // Check if radioButtons property exists, otherwise fallback to an empty object
  
        return {
          id: containerData.id,
          active: containerData.active,
          pathId: containerData.pathId,
          images,
          imagePositions,
          textFields,
          textFieldPositions,
          radioButtons,
          pathDescription
          
        };
      });
  
      return {
        storyName: storyboardData['storyName'],
        containers: containers,
      };
    } else {
      return null;
    }
}

  


getPathLetter(radioButtons: { [key: string]: boolean }): string {
  for (const radioButton in radioButtons) {
    if (radioButtons[radioButton]) {
      return radioButton;
    }
  }

  return '';
}



  async getAllStoryboardsByUserId(userId: string): Promise<Storyboard[] | null> {
    
    const storyboardsRef = collection(this.firestore, 'storyboards');
    const storyboardDocs = await getDocs(query(storyboardsRef, where("userId", "==", userId)));

    if (!storyboardDocs.empty) {
      let storyboards: Storyboard[] = [];
      storyboardDocs.forEach((doc) => {
        const storyboardData = doc.data();
        storyboards.push({
          id: doc.id, 
          userName: storyboardData['userName'],
          storyName: storyboardData['storyName'],
          storyTopic: storyboardData['storyTopic'],
  
          containers: storyboardData['containers'],
        });
      });
      return storyboards;
    } else {
      return null;
    }
  }
  

  async getAllStoryboards(): Promise<Storyboard[] | null> {
    const storyboardsRef = collection(this.firestore, 'storyboards');
    const storyboardDocs = await getDocs(storyboardsRef);
  
    const userId = await this.authService.getCurrentUserId();

    if (!storyboardDocs.empty) {
      let storyboards: Storyboard[] = [];
      storyboardDocs.forEach((doc) => {
        const storyboardData = doc.data();
        storyboards.push({
          id: doc.id, // include the ID in the returned data
          userName: storyboardData['userName'],
          // userId: userId,
          storyName: storyboardData['storyName'],
          storyTopic: storyboardData['storyTopic'],
  
          containers: storyboardData['containers'],
        });
      });
      return storyboards;
    } else {
      return null;
    }
  }
}
