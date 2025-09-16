import { messages, user } from './firebase';
import { query, orderBy, limit, serverTimestamp, onSnapshot, addDoc } from 'firebase/firestore';
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';
import './styles/chat.css';

const chat = document.getElementById('chat');
const messageBox = document.getElementById('message');
const sendButton = document.getElementById('send-button');
let initialLoad = true;

function getUsername(uid) {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, names],
    separator: '',
    style: 'capital',
    seed: uid
  });
}

function formatTimestamp(timestamp) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(timestamp.toDate());
}

function fail(msg) {
    alert(msg);
    sendButton.disabled = false;
}

function sendMessage() {
    sendButton.disabled = true;
    const message = messageBox.value.trim();

    if (message.length == 0) return fail('Please enter a message.');
    if (message.length > 2000) return fail('Message is too long. The limit is 2,000 characters.');
    if (!user) return fail('Something went wrong. Reload the page and try again.');

    addDoc(messages, {
        message: message,
        user: user.uid,
        timestamp: serverTimestamp()
    }).then(response => {
        document.getElementById('message').value = '';
        sendButton.disabled = false;
    }).catch(error => {
        fail('Something went wrong. Reload the page and try again.');
    });
}

sendButton.addEventListener('click', sendMessage);
messageBox.addEventListener('keydown', e => e.key === 'Enter' ? sendMessage() : null);

const q = query(messages, orderBy('timestamp', 'desc'), limit(100));
onSnapshot(q, snapshot => {
    snapshot.forEach((doc) => {
        if (document.querySelector(`[data-id='${doc.id}']`)) return;
        
        const message = doc.data();

        const msg = document.createElement('div');
        msg.className = 'raised message';
        msg.dataset.id = doc.id;

        const header = document.createElement('div');
        header.className = 'row space-between message-header';

        const author = document.createElement('h3');
        author.textContent = getUsername(message.user);
        header.appendChild(author);

        const time = document.createElement('span');
        time.textContent = formatTimestamp(message.timestamp);
        time.className = 'timestamp';
        header.appendChild(time);

        msg.appendChild(header);

        const content = document.createElement('span');
        content.textContent = message.message;
        content.className = 'message-content';
        msg.appendChild(content);

        if (initialLoad) chat.prepend(msg);
        else chat.appendChild(msg);
    });
    chat.scrollTop = chat.scrollHeight;
    initialLoad = false;
});
