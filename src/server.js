import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";
import express from "express";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");

// /public으로 가게 되면 __dirname + /public 폴더를 보여줌
// public url을 생성해서 유저에게 파일 공유
app.use("/public", express.static(__dirname + "/public"));

// home.pug 렌더링
app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));

const handListen = () => console.log(`Listening on http://localhost:3000`);

// http 서버
// createServer를 하려면 requestListner 경로가 필요 = express
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false
});

// 현재 존재하는 publicRooms를 알아내는 함수
function publicRooms() {
  // 웹소켓 서버에서 sids, rooms를 구조분해 할당
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if(sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}


function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
};


wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) =>{
    console.log(wsServer.sockets.adapter);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    console.log(publicRooms());
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) -1));
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    console.log(`new msg: ${msg}`);
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  })

  socket.on("nickname", nickname => socket["nickname"] = nickname);
});

httpServer.listen(3000, handListen);