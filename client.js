const fs = require("fs");

var readline = require("readline"),
  socketio = require("socket.io-client"),
  util = require("util"),
  color = require("ansi-color").set;

var socket = socketio.connect("http://localhost:3000");
var rl = readline.createInterface(process.stdin, process.stdout);

let nick;
const his = [];

rl.question("Please enter a nickname: ", function (name) {
  socket.emit("user", name);
  nick = name;
  rl.prompt(true);
});

function console_out(msg) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
}
rl.on("line", function (line) {
  rl.prompt(true);
  socket.emit("msg", line);
});

socket.on("smiley", (smiley) =>{
  fs.readFile('./smiley.txt', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(data)
  })
});

socket.on("msg", function (his) {
  console.log(typeof his);
  if (!nick || typeof his === "undefined") {
    return null;
  }
  let msg = his.pop();
  while (msg[0] === ">") {
    console_out(msg[0] + " : " + msg[1]);
    msg = his.pop();
  }
  console_out(msg[0] + " : " + msg[1]);
  // console.log(msg);
});

socket.on("userchange", function (his) {
  if (!nick) {
    return null;
  }
  nick = his.nick;
  // console.log(msg);
});
