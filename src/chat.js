import './styles/chat.css';
import {
    messages,
    user
} from './firebase';
import {
    onSnapshot,
    query,
    orderBy,
    limit,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    uniqueNamesGenerator,
    adjectives,
    names
} from 'unique-names-generator';

function getUsername(uid) {
  const config = {
    dictionaries: [adjectives, names],
    separator: '',
    style: 'capital',
    seed: uid
  };

  return uniqueNamesGenerator(config);
}

function formatTimestamp(timestamp) {
    const date = timestamp.toDate();
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}

const chat = document.getElementById('chat');
let initialLoad = true;

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

const sendButton = document.getElementById('send-button');
const messageBox = document.getElementById('message');

sendButton.addEventListener('click', () => {
    sendButton.disabled = true;
    const message = messageBox.value.trim();
    if (message.length == 0) {
        alert('Please enter a message.');
        sendButton.disabled = false;
        return;
    }
    if (message.length > 2000) {
        alert('Message is too long. The limit is 2,000 characters.');
        sendButton.disabled = false;
        return;
    }
    if (!user) {
        alert('Something went wrong. Reload the page and try again.');
        sendButton.disabled = false;
        return;
    }
    addDoc(messages, {
        message: message,
        user: user.uid,
        timestamp: serverTimestamp()
    }).then(response => {
        document.getElementById('message').value = '';
        sendButton.disabled = false;
    }).catch(error => {
        sendButton.disabled = false;
    });
});

messageBox.addEventListener('keydown', (event) => {
    console.log(event.key);
    if (event.key === 'Enter') sendButton.click();
});
