import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc
} from 'firebase/firestore';
import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously
} from 'firebase/auth';
import './styles/page.css';

const firebaseConfig = {
    apiKey: "AIzaSyDLQP-hlYGriNrKtIBEMo59J0jLmizvP1Y",
    authDomain: "innominate-wall.firebaseapp.com",
    projectId: "innominate-wall",
    storageBucket: "innominate-wall.firebasestorage.app",
    messagingSenderId: "560000206321",
    appId: "1:560000206321:web:907ff24ce57eafd62f3050"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
export let user = null;

export const messages = collection(db, 'messages');

const entries = collection(db, 'entries');
export const wall = doc(entries, 'wall');

onAuthStateChanged(auth, usr => {
    if (!usr) signInAnonymously(auth);
    else user = usr;
});
