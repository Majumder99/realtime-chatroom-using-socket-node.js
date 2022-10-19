const socket = io();
const chatMessages = document.querySelector(".chat-messages");
// console.log(socket);

const chatForm = document.getElementById("chat-form");

//Get username and  room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log(username, room);

//message from server
socket.on("message", (message) => {
  //   console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//mesasge submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  //console.log(msg);
  //emit message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output message to DOM
const outputMessage = (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
            <p class="text">
             ${msg.text}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

//join chatroom
socket.emit("joinRoom", { username, room });
