import Chatroom from './modules/chats.js';
import ChatUI from './modules/ui.js';

const ulMenu = document.querySelector('.menu');
const liMenu = document.querySelectorAll('.menu li');
const ulMessages = document.querySelector('.messages');
const formSend = document.getElementById('send');
const inputMessage = document.getElementById('message');
const inputUsername = document.getElementById('username');
const btnUpdate = document.querySelector('input[name=update]');
const divAlert = document.getElementById('alert');

const chatroom = new Chatroom(localStorage.getItem('chatroom') || 'general', localStorage.getItem('username') || 'Guest');
const chatUI = new ChatUI(ulMessages);

getChatroom(chatroom, chatUI);

switch (localStorage.getItem('chatroom')) {
    case 'general':
        liMenu[0].classList.add('clicked');
        break;
    case 'js':
        liMenu[1].classList.add('clicked');
        break;
    case 'homework':
        liMenu[2].classList.add('clicked');
        break;
    case 'tests':
        liMenu[3].classList.add('clicked');
        break;
    default:
        liMenu[0].classList.add('clicked');
}

function getChatroom(chatroom, chatUI) {
    chatUI.clearUl();
    chatroom.getChats(data => chatUI.templateLI(data));
}

function clearLiClass(arr) {
    arr.forEach(li => {
        li.classList.remove('clicked');
    });
}

// CHANGE ROOM
ulMenu.addEventListener('click', event => {
    if (event.target.tagName == 'LI') {
        let target = event.target.textContent.slice(1);
        clearLiClass(liMenu);
        event.target.classList.add('clicked');
        chatroom.updateRoom(target);
        localStorage.setItem('chatroom', target);
        getChatroom(chatroom, chatUI);
    }
});

// SEND
formSend.addEventListener('submit', event => {
    event.preventDefault();
    chatroom.updateUsername(localStorage.getItem('username') || 'Guest');

    if (!inputMessage.value.match(/\w/)) return; 

    chatroom.addChat(inputMessage.value)
    .then(() => formSend.reset())
    .catch(err => console.log(err));
});

// USERNAME
btnUpdate.addEventListener('click', () => {
    chatroom.updateUsername(inputUsername.value);
    if (!inputUsername.value.match(/[^\s][a-zA-Z]{2,10}/)) return;

    divAlert.textContent = "Your username is updated!"
    setTimeout(() => {
        inputUsername.value = "";
        divAlert.textContent = "";
    }, 3000);
});
