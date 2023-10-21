import { ObjectPosition } from "./object-position";



export interface Container {
  id: string;
  active: boolean;
  images: { [key: string]: string };
  imagePositions: { [key: string]: ObjectPosition };
  textFields: { [key: string]: string };
  textFieldPositions: { [key: string]: ObjectPosition };
  pathId: string;
  radioButtons?: any;

}
