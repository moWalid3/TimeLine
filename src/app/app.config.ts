import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ApplicationConfig } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";

const firebaseConfig = {
  apiKey: "AIzaSyB0FLB44Eo67gFApYHll6qfFmzltMcbssI",
  authDomain: "timeline-eac3f.firebaseapp.com",
  projectId: "timeline-eac3f",
  storageBucket: "timeline-eac3f.appspot.com",
  messagingSenderId: "816770391440",
  appId: "1:816770391440:web:16d547f7ddbf1817046715"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-fall' })),
    
    provideFirebaseApp(() => initializeApp(firebaseConfig)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage())
  ],
};

