import { Component, ErrorHandler } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ErrorDialogComponent } from 'src/app/error-dialog/error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  firebaseErrorMessage: string;

  constructor(private authService: AuthenticationService, 
    private router: Router, 
    public errorHandlerService: ErrorHandler,
    private dialog: MatDialog) {
      this.loginForm = new FormGroup({
          'email': new FormControl('', [Validators.required, Validators.email]),
          'password': new FormControl('', Validators.required)
      });

      this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
       
  }

  loginUser() {
    if (this.loginForm.invalid)
      return;
  
    this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((result) => {
      if (result && result.isValid) { // Check if result exists and is valid
        console.log('login success');
        this.router.navigate(['/dashboard']);
      } else if (result && result.isValid === false) { // Check if result exists and isValid is explicitly false
        console.log('login error', result);
        this.dialog.open(ErrorDialogComponent, {
          data: { message: result.message }
        });
      } else {
        // Handle unexpected result structure or undefined
        console.log('Unexpected result', result);
        this.dialog.open(ErrorDialogComponent, {
          data: { message: 'An unexpected error occurred.' }
        });
      }
    }).catch((error) => {
      // Handle any errors that occur during login
      console.error('Login error', error);
      this.dialog.open(ErrorDialogComponent, {
        data: { message: error.message || 'An error occurred during login.' }
      });
    });
  }
  
}