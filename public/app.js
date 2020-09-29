import Chatroom from './modules/chats.js';
import ChatUI from './modules/ui.js';

const ulMenu = document.querySelector('.menu');
const liMenu = document.querySelectorAll('.menu li');
const ulMessages = document.querySelector('.messages');
const formSend = document.getElementById('send');
const message = document.getElementById('message');
const inputUsername = document.getElementById('username');
const btnUpdate = document.querySelector('input[name=update]');
const divAlert = document.getElementById('alert');
const inputColor = document.querySelector('input[name=color]');
const updateColor = document.getElementById('updateColor');
const resetColor = document.getElementById('resetColor');
const inputDateFrom = document.querySelector('input[name=datefrom]');
const inputDateTo = document.querySelector('input[name=dateto]');
const setDates = document.getElementById('setDates');

const chatroom = new Chatroom(localStorage.getItem('chatroom') || 'general', localStorage.getItem('username') || 'Guest');
const chatUI = new ChatUI(ulMessages);

// Safari not supported right now
let isSafari = /constructor/i.test(window.HTMLElement) || (p => { 
    return p.toString() === "[object SafariRemoteNotification]"; 
})(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

if (isSafari) {
    document.write = "Sorry, this app is not supported by Safari browser. Try Chrome or Firefox :)"
}

// Pull messages from base
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
    chatroom.getChats((data, id) => {
        chatUI.templateLI(data, id);
    });
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
    submitForm();
});

message.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !e.shiftKey) {
        submitForm();
    }
});

function submitForm() {
    chatroom.updateUsername(localStorage.getItem('username') || 'Guest');
    if (!message.value.match(/\w/)) return; 
    chatroom.addChat(message.value)
    .then(() => formSend.reset())
    .catch(err => console.log(err));
}

// USERNAME
btnUpdate.addEventListener('click', () => {
    chatroom.updateUsername(inputUsername.value);
    if (!inputUsername.value.match(/[^\s][a-zA-Z]{2,10}/)) return;

    divAlert.textContent = "Your username is updated!";
    setTimeout(() => {
        inputUsername.value = "";
        divAlert.textContent = "";
    }, 3000);
});

// Delete messages
ulMessages.addEventListener('click', event => {
    if (event.target.tagName == 'DIV' && event.target.classList.contains('delete')) {
        let id = event.target.getAttribute('data-id');

        if (event.target.parentElement.getAttribute('class') == 'other') {
            event.target.parentElement.remove();
        }
        else if (confirm('Your message will be permanently deleted. Are you sure?')) {
            db.collection('chats').doc(id)
            .delete()
            .then(() => alert('Message is deleted!'))
            .catch(err => console.log('Error', err));
        }
    }
});

if (localStorage.getItem('color')) {
    inputColor.value = localStorage.getItem('color');
    document.body.style.backgroundColor = localStorage.getItem('color');
}

resetColor.addEventListener('click', () => {
    document.body.style.backgroundColor = '#dadada';
    localStorage.setItem('color', '#dadada');
    inputColor.value = localStorage.getItem('color');
});

updateColor.addEventListener('click', event => {
    setTimeout(() => {
        document.body.style.backgroundColor = inputColor.value;
        localStorage.setItem('color', inputColor.value);
    }, 500);
});

setDates.addEventListener('click', event => {
    let start = new Date(inputDateFrom.value);
    let end = new Date(inputDateTo.value);

    chatUI.clearUl();

    db.collection('chats')
    .where('created_at', '>=', start)
    .where('created_at', '<=', end)
    .orderBy('created_at')
    .get()
        .then(snapshot => {
            if (!snapshot.empty) {
                snapshot.docs.forEach(doc => {
                    chatUI.templateLI(doc.data());
                });
            } else {
                alert(`There are no messages sent from ${start} to ${end}.`);
            }
        })
        .catch(err => console.log("Error", err))
});