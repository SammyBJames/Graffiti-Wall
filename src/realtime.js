import { wall } from './firebase';
import { onSnapshot } from 'firebase/firestore';

const content = document.getElementById('content');

onSnapshot(wall, snap => content.innerHTML = snap.data().contents);
