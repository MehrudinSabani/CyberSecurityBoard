import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPathPipe'
})
export class CustomPathPipePipe implements PipeTransform {

  transform(value: string): string {
    // Split the string into 'path' and the rest
    const parts = value.split('path');
    // Transform the rest to uppercase and join them with ' - '
    const formatted = parts[1].toUpperCase().split('').join(' - ');
    // Combine 'PATH' with the formatted rest
    return `PATH - ${formatted}`;
  }
}
