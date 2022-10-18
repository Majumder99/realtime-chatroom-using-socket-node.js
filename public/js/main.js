const socket = io();
// console.log(socket);

const chatForm = document.getElementById("chat-form");

//message from server
socket.on("message", (message) => {
  //   console.log(message);
  outputMessage(message);
});

//mesasge submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  //console.log(msg);
  //emit message to server
  socket.emit("chatMessage", msg);
});

//Output message to DOM
const outputMessage = (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
            <p class="text">
             ${msg}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};
