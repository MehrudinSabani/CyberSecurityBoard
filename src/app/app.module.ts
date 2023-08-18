import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import {DragDropModule} from '@angular/cdk/drag-drop'; 

// firebase init
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { BoardComponent } from './board/board.component';
import { UploadImageDetailsComponent } from './upload-image-details/upload-image-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './board/sidebar/sidebar.component';
import { TextFieldComponent } from './board/text-field/text-field.component';
import { ImageComponent } from './board/image/image.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ExploreComponent } from './main-menu/explore/explore.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './header/signup/signup.component';
import { LoginComponent } from './header/login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialogModule} from '@angular/material/dialog';
import { StoryboardFormComponent } from './main-menu/storyboard-form/storyboard-form.component';
import { ViewStoryboardComponent } from './board/view-storyboard/view-storyboard.component';
import { EditStoryboardComponent } from './board/edit-storyboard/edit-storyboard.component';
import { FullScreenComponent } from './board/view-storyboard/full-screen/full-screen.component';
import { FilterByPathIdPipe } from './board/filter-by-path-id.pipe';



@NgModule({          
  declarations: [
    AppComponent,
    BoardComponent,
    UploadImageDetailsComponent,
    SidebarComponent,
    ImageComponent,
    TextFieldComponent,
    MainMenuComponent,
    ExploreComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    UserDashboardComponent,
    StoryboardFormComponent,
    ViewStoryboardComponent,
    EditStoryboardComponent,
    FullScreenComponent,
    FilterByPathIdPipe
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,

    // material modules
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,


    // angular firebase integration
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
