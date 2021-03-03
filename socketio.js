// var io = require("socket.socket-client");
socketio = null;

function handler(io) {
  socketio = io;
  
}

function addTaskEvent(data) {
  console.log("our data", data);
  socketio.emit("add item", data);
}

// //fire event when task is updated
function updateTaskEvent(data) {
  socketio.emit("update", data);
}

function editTask(data) {
  socketio.emit("edit", data);
}

function DeleteTask(data) {
  socketio.emit("delete", data);
}

(exports.addTaskEvent = addTaskEvent),
  (exports.updateTaskEvent = updateTaskEvent),
  (exports.editTask = editTask),
  (exports.DeleteTask = DeleteTask),
  (exports.handler = handler);
