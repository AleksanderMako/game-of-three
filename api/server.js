var app = require('express')();
var server = require('http');
var io = require('socket.io')(server);

module.exports = class Server {

    // feed controllers to server constructor 
    constructor(registrationController, gameController) {

        this.server = server.Server(app);
        this.registerController = registrationController;
        this.gameController = gameController;
        this.connectionList = new Map();

    }
    // TODO: INCLUDE SOME VALIDATION FOR INCOMING DATA 
    async start() {
        this.server.listen(3000);
        console.log("INFO: server is running ");

        io.sockets.on("connection", function (socket) {

            console.log("INFO: socket connected ");

            // register event 
            socket.on("register", async function () {
                const registrationData = await this.registerController.register();
                this.connectionList.set(registrationData.playerID, socket);
                socket.emit("register response", registrationData);
            });

            // set number  event 
            // data has gameID,PID, current number 
            socket.on("number", async function (data) {
                try {
                    if (this.gameController.doesGameExist(data)) {
                        await this.gameController.setNumber(data);
                    }
                } catch (error) {
                    socket.emit("Error", "an error occured while trying to update the database " + error);
                }
                // get receiving socket 
                try {
                    const receivingSocket = this.getSocket();
                    receivingSocket.emit("get-number",data.number);
                } catch (error) {
                    socket.emit("Error", error);
                }

            });
            // TODO: handle socket disconection / remove connection from map 
            socket.on("disconnect", () => { });
        })
    }
    getSocket(data) {
        const game = await this.gameController.getGame(data);
        // if true  = if closed => both players have joined 
        if (game.gameStatus) {
            if (data.gameID === game.player1ID) return this.connectionList.get(game.player2ID);
            else if (data.gameID == game.player2ID) return this.connectionList.get(game.player1ID);
            else throw new Error("you are not a player in the game with ID: "+ data.gameID);
        }
    }
}