const messageList= document.querySelector('ul');
const messageForm =  document.querySelector("#message");
const nickForm =  document.querySelector("#nick");
// socket: 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = {type, payload};
  return JSON.stringify(msg);
}


function handleOpen() {
  console.log("Connect to Server ✅");
}


socket.addEventListener("open", handleOpen)

socket.addEventListener("message", (message) => {
  // console.log("New message: ", message.data);
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("disconnected server");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value.toString()));
  input.value = "";
}
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value.toString()));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);