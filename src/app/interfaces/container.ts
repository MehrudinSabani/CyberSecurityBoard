import { ImagePosition } from "./image-position";

export interface Container {
  id: string;
  active: boolean;
  images: { [key: string]: string };
  imagePositions: { [key: string]: ImagePosition };
  textFields: { [key: string]: string };
  textFieldPositions: { [key: string]: ImagePosition };
}
