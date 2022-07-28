// const e = require("connect-flash");


const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from url
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join the chatroom
socket.emit('joinRoom', { username, room});

//getroom and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

//message from the server
socket.on('message', message => {
    console.log(message)
    outputMessage(message);

    //scroll down on receiving the message
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get the message
    const msg = e.target.elements.msg.value;
    //emit message to the server
    socket.emit('chatMessage', msg);

    //clear input after messaging
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//output message to the DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    </div>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//add room name to DOm
function outputRoomName(params) {
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users) {
    userList.innerHTML  = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
    
}