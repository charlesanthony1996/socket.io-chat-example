var express = require("express");
var app = express()
var http = require("http")
var server = http.createServer(app)
var { Server } = require("socket.io")
var io = new Server(server)



users =[]
connections = []


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


//socket creation
io.sockets.on("connection", function (socket) {
    connections.push(socket);
    console.log("connected %s sockets ", connections.length);

    //disconnect
    socket.on("disconnect", function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected %s sockets", connections.length);
    })

    //send message
    socket.on("send message", function(data) {
        console.log(data)
        io.sockets.emit("new message", { msg:data, user:socket.username})
    })

    //new user
    socket.on("new user", function(data, callback) {
        callback(true)
        socket.username = data;
        users.push(socket.username);
        updateUsernames()
    })

    function updateUsernames() {
        io.sockets.emit("get users", users);
    }


})





server.listen(3000)
console.log("server running")
