# video-chatroom-using-webrtc-peerjs-in-nodejs
this project use peerjs server and socket.io for provide video chat room in nodejs and expressjs 

## Installation 
- after cloning projcet from github first run 
```bash
npm i 
```
in terminal for install dependencies

## usage
- next, start peerjs server on port 3001 and start node server using this commands

```bash
peerjs --port 3001
npm run devStart
```
- after that start localhost on port 3000 on your browser. first you can create room and after that you can enter the shared url in the new tab to make video chat between 2 tabs 

- note that this project use navigator.getusermedia() api and its only work on https connection and localhost. you can use ngrok server for peerjs and express server
