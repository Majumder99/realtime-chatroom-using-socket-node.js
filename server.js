const express = require("express");
const path = require("path");
const http = require("http");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 8000;

//middleware
app.use(express.static(path.join(__dirname, "public")));
const botName = "chatcod";

//run when client connects
io.on("connection", (socket) => {
  // console.log("New ws connection...");

  // //1st way
  // //emit everyboady include the user
  // socket.emit("message", formatMessage(botName, "Welcome to current user"));

  // //2nd way
  // //Broadcast when a user connects
  // //emit everyboady except user.. who sends the message
  // socket.broadcast.emit(
  //   "message",
  //   formatMessage(botName, "A user had joined the chat")
  // );

  //runs when clien disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });

  //3rd way
  //broadcast everyboady in general
  // io.emit();

  //listen for chatMessage
  socket.on("chatMessage", (msg) => {
    // console.log(msg);
    const user = getCurrentUser(socket.id);

    //user.room means that, which room the user in.. user message will only be sent to that room
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    //joining the room. It means creating a room
    socket.join(user.room);
    //1st way
    //emit everyboady include the user
    socket.emit(
      "message",
      formatMessage(botName, `Welcome to the chatroom ${username}`)
    );

    //2nd way
    //Broadcast when a user connects
    //emit everyboady except user.. who sends the message
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat room`)
      );

    //runs when clien disconnects
    socket.on("disconnect", () => {
      io.emit(
        "message",
        formatMessage(botName, `${username} has left chat room`)
      );
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
