import { wall } from './firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDoc } from 'firebase/firestore';
import './styles/edit.css';

const updateWall = httpsCallable(getFunctions(), 'updateWall');
const changes = document.getElementById('changes');

getDoc(wall).then(doc => {
    changes.value = doc.data().contents
    changes.removeAttribute('readonly');
});

document.getElementById('save-button').addEventListener('click', async () => {
    updateWall({ contents: changes.value.trim() })
    .then(result => {
        if (result.data.success) location.href = '/';
        else alert(result.data.error);
    })
    .catch(e => alert(e));
});
