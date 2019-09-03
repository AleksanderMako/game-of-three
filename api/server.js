var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// TODO: set up event string in vars in const class 
module.exports = class Server {

    // feed controllers to server constructor 
    constructor(registrationController, gameController) {
        if (!registrationController) {
            throw new Error("ERROR: empty registration controller passed")
        }
        this.server = server;
        this.registerController = registrationController;
        this.gameController = gameController;
        this.connectionList = new Map();
    }
    // TODO: INCLUDE SOME VALIDATION FOR INCOMING DATA 
    async start() {

        io.on("connection", (socket) => {

            console.log("INFO: socket connected \n");

            socket.emit("welcome", "Welcome to the game of 3 server");

            // register event 
            socket.on("register", async (data) => {
                console.log("INFO:server received register request\n");
                const registrationData = await this.registerController.registerPlayer();
                console.log("INFO: registration data " + JSON.stringify(registrationData) + "\n");

                this.connectionList.set(registrationData.playerID, socket);
                socket.emit("register-response", registrationData);
            });

            // set number  event 
            // data has gameID,PID, current number 
            socket.on("number", async (data) => {
                console.log("INFO:server received number request\n");

                try {
                    if (this.gameController.doesGameExist(data)) {
                        await this.gameController.setNumber(data);
                    }
                } catch (error) {
                    console.log("DEBUG: SET NUMBER " + JSON.stringify(data));
                    console.log("ERROR: while setting number " + error);
                    socket.emit("Error", "an error occured while trying to update the database " + error);
                }
                // get receiving socket 
                try {
                    const receivingSocket = await this.getSocket(data);
                    if (receivingSocket) {
                        receivingSocket.emit("get-number", data.currentNumber);
                    }
                } catch (error) {
                    console.log("ERROR: while retreiving socket " + error);
                    socket.emit("Error", error);
                }

            });
            // TODO: handle socket disconection / remove connection from map 
            socket.on("disconnect", () => { });
        })

        this.server.listen(3000, () => {
            console.log("INFO: server is running ");
        });
    }
    async getSocket(data) {
        const game = await this.gameController.getGame(data);
        // if true  = if closed => both players have joined 
        if (game.gameStatus) {
            if (data.playerID === game.player1ID) return this.connectionList.get(game.player2ID);
            else if (data.playerID == game.player2ID) return this.connectionList.get(game.player1ID);
            else throw new Error("you are not a player in the game with ID: " + data.gameID);
        }
    }
}