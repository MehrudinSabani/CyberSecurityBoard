import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  errorMessage: string;

  handleError(error: Error){
    this.errorMessage = error.message;
  }
}
