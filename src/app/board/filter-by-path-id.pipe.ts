import { Pipe, PipeTransform } from '@angular/core';
import { Container } from '../interfaces/container';

@Pipe({
  name: 'filterByPathId'
})
export class FilterByPathIdPipe implements PipeTransform {
  transform(containers: Container[], pathId: string): Container[] {
    return containers.filter((container) => container.pathId === pathId);
  }
}
