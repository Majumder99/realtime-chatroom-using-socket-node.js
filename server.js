// io.on() This is registering an event handler for a specific event. That is when the object raises that specific event your code will be called. So in this context io is your socket.io server object. When a client connects it will raise the connect event allowing you to handle it.

// https://nodejs.org/api/events.html#events_events

// socket is your handle on that specific client connection. It allows you to communicate directly with that client. emit and on allows you to listen to events from that specific client or emit events to that specific client.

// io.emit allows you to emits events to all connected clients.

// http://socket.io/docs/server-api/#server#emit

// io.emit sends all the client
//  socket.emit sends particular client

const express = require("express");
const path = require("path");
const http = require("http");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

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

    io.to(user.room).emit("roomUser", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  //runs when clien disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log("disconnect occurs");
    //io.to(user.room) means to all clients in room1 except the sender
    if (user) {
      console.log("disconnect occurs in io");
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left chat room`)
      );
      io.to(user.room).emit("roomUser", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
