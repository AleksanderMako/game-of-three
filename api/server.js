var app = require('express')();
var server = require('http');
var io = require('socket.io')(server);

// TODO: add env var 
console.log("server is running ");

module.exports = class Server {

    // feed controllers to server constructor 
    constructor(registrationController) {

        this.server = server.Server(app);
        this.registerController = registrationController;

    }

    start() {
        this.server.listen(3000);
        console.log("INFO: server is running ");

        io.sockets.on("connection", function (socket) {

            console.log("INFO: socket connected ");

        // register event 
        socket.on("register", async function(){
          const  registrationData=   await this.registerController.register();
          socket.emit("register response", registrationData);
        });
        // send number event / number  event 

        // TODO: handle socket disconection
        socket.on("disconnect",()=>{});
        })
    }
}