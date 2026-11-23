import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtRaxkhywwSCNUle5F_3jd5uF6636Ko00",
  authDomain: "luxora-f3f7d.firebaseapp.com",
  projectId: "luxora-f3f7d",
  storageBucket: "luxora-f3f7d.firebasestorage.app",
  messagingSenderId: "855248837090",
  appId: "1:855248837090:web:9b502b4bcfd26a696d01bb"
};



const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
