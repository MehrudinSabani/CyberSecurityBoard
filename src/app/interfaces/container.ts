import { ObjectPosition } from "./object-position";
import { TextField } from "./text-field";



export interface Container {
  id: string;
  active: boolean;
  images: { [key: string]: string };
  imagePositions: { [key: string]: ObjectPosition };
  textFields: { [key: string]: TextField };
  textFieldPositions: { [key: string]: ObjectPosition };
  pathId: string;
  pathDescription?: { [key: string]: TextField };
  radioButtons?: any;

}
