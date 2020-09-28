const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");
const short = require("short-uuid");

const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1/video-chat";
let roomsModel = require("./models/rooms");
const rooms = require("./models/rooms");

mongoose.connect(url, { useNewUrlParser: true });
let db = mongoose.connection;
db.on("connected", function () {
  console.log("db is connected");
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static("node_modules"));

//socket
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
      roomsModel
        .findOne({ url: roomId })
        .then(function (room) {
          room.userCount = room.userCount - 1;
          room.save();
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  });
});

//routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/room", (req, res) => {
  let url = short.generate();
  roomsModel({ url })
    .save()
    .then(() => {
      res.redirect(`/${url}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/room", (req, res) => {
  let entredUrl = req.body.url;
  roomsModel
    .findOne({ url: entredUrl })
    .then((findedUrl) => {
      if (findedUrl != null) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/List", (req, res) => {
  roomsModel
    .find()
    .then((rooms) => {
      res.send(rooms);
    })
    .catch((err) => {
      res.send(err);
    });
});
app.get("/:room", (req, res) => {
  let entredUrl = req.params.room;
  roomsModel
    .findOne({ url: entredUrl })
    .then(function (room) {
      room.userCount++;
      room.save();
    })
    .catch((err) => {
      console.log(err);
    });
  res.render("room", { roomId: req.params.room });
});
server.listen(3000);
