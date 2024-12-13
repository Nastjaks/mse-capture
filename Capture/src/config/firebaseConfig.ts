import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBt5GsAcAXndCll8wO-8jqV0vxWfIhZaw0",
    authDomain: "capture-3d553.firebaseapp.com",
    projectId: "capture-3d553",
    storageBucket: "capture-3d553.firebasestorage.app",
    messagingSenderId: "293344687299",
    appId: "1:293344687299:web:f7c77586b22ac940319e76"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app);