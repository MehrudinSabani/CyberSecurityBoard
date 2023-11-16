import { Injectable } from '@angular/core';
import { ObjectPosition } from '../interfaces/object-position';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor() { }

  private positions: { [containerId: string]: { [elementId: string]: ObjectPosition } } = {};

  getPositions(containerId: string): { [elementId: string]: ObjectPosition } {
    return this.positions[containerId];
  }

  savePositions(containerId: string, positions: { [elementId: string]: ObjectPosition }) {
    this.positions[containerId] = positions;
  }
  
}
