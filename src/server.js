import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io"
import express from "express";

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
// app.listen(3000);

// http 서버
// createServer를 하려면 requestListner 경로가 필요 = express
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
  socket.on("enter_room", (msg, done) => console.log(msg));
});
// websocket 서버
// const wss = new WebSocket.Server({ server });




// const sockets = [];

// // socket: 연결된 브라우저
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connect to Brower ✅");
//   socket.on("close", ()=> console.log("Disconnected from the Browser ❌"));
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     const t = message.payload;
//     switch(message.type) {
//       case "new_message":
//         // t.toString;
//         sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${t.toString()}`));
//         // console.log(`${socket.payload}`);
//         break;
//       case "nickname":
//         console.log(message.payload);
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// });


httpServer.listen(3000, handListen);

