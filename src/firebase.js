import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Firebase web-app configuration (public identifiers, not service credentials).
const config={
  apiKey:"AIzaSyDEO4nCm6-391qMfSxoo8oFV4-ZQt2iZlI",
  authDomain:"pnv-manager.firebaseapp.com",
  projectId:"pnv-manager",
  storageBucket:"pnv-manager.firebasestorage.app",
  messagingSenderId:"105310221103",
  appId:"1:105310221103:web:8073be9b0547ad2d9527da",
  measurementId:"G-0GQH472C58"
};
export const configured=true;
export const app=initializeApp(config);
export const auth=getAuth(app);
export const db=getFirestore(app);
