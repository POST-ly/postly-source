function socketIO(io) {
  const teams = new Set()

    io.on("connection", function (socket) {
    
      console.log("Made socket connection");

      socket.on("new user", function (data) {
        socket.userId = data;
        teams.add(data);
        io.emit("new user", [...activeUsers]);
      });

      socket.on("message", function (data) {
        if (teams.get(data.teamId)) {
          var team = teams.get(data.teamId)
        } else {
          const s = new Set()
          teams.set(data.teamId, )
        }
      });

      socket.on("disconnect", () => {
        teams.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
      });
  });
}

module.exports = socketIO
