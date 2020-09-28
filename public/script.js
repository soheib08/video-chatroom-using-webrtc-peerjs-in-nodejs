//the peerjs server has started so everytime a new user is connected it
//will assign a new userid to it automatically.

const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
  host: "5.253.27.171",
  port: "9000",
  path: "/myapp",
});
const myVideo = document.createElement("video");
myVideo.id = "presnetor";
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    //friends video
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      video.id = "guest";
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    //Calling Other User
    socket.on("user-connected", (userId) => {
      console.log("User Connected " + userId);
      connectToNewUser(userId, stream);
    });
  });

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  video.id = "guest";
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    document.getElementById("details").style.visibility = "visible";
  });
  videoGrid.append(video);
}
