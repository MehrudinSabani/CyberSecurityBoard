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
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './board/sidebar/sidebar.component';
import { ResizableImageComponent } from './resizable-image/resizable-image.component';
import { ResizableDragableComponent } from './resizable-dragable/resizable-dragable.component';


const routes: Routes = [
  { path: '', component: BoardComponent}, 
  { path: 'storyboard', component: BoardComponent},
  { path: 'upload', component: UploadImageDetailsComponent}, 
  { path: 'resize', component: ResizableImageComponent}, 


 


]

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    UploadImageDetailsComponent,
    SidebarComponent,
    ResizableImageComponent,
    ResizableDragableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forRoot(routes),


    // angular firebase integration
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
