const express = require("express");
const path = require("path");
const http = require("http");
// const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 8000;

//middleware
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
io.on("connection", (socket) => {
  // console.log("New ws connection...");

  //1st way
  //emit everyboady include the user
  socket.emit("message", "Welcome to current user");

  //2nd way
  //Broadcast when a user connects
  //emit everyboady except user.. who sends the message
  socket.broadcast.emit("message", "A user had joined the chat");

  //runs when clien disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  //3rd way
  //broadcast everyboady in general
  // io.emit();

  //listen for chatMessage
  socket.on("chatMessage", (msg) => {
    // console.log(msg);
    io.emit("message", msg);
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
