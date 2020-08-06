function socketIO(io) {
  io.set("origins", "*:*")
  const teams = new Set()

    io.on("connection", function (socket) {
    
      socket.on("join", function (data) {
        socket.room = data.teamId
        socket.join(data.teamId)
        io.emit("joined", true);
      });

      socket.on("message", function (data) {
        io.sockets.in(socket.room).emit("message", data)
      });

      socket.on("disconnect", () => {
        io.emit("user disconnected", socket.userId);
      });
  });
}

module.exports = socketIO
