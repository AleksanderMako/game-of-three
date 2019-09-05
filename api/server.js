var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    pingTimeout:25000
});
var logger = require("./config/logger");
module.exports = class Server {

    constructor(registrationController, gameController) {

        if (!registrationController) throw new Error("ERROR: empty registration controller passed in server constructor")
        if (!gameController) throw new Error("ERROR: empty game controller passed in server constructor")

        this.server = server;
        this.registerController = registrationController;
        this.gameController = gameController;
        this.connectionList = new Map();
        this.l = logger();
    }

    async start() {

        io.on("connection", (socket) => {
            this.l.info("Socket connected ");

            socket.emit("welcome", "Welcome to the game of 3 server");

            // register event 
            socket.on("register", async (data) => {
                this.validateRegisterEvent(data, socket);
                this.l.info("server received register request");
                try {

                    const registrationData = await this.registerController.registerPlayer();
                    this.l.debug("registration data " + JSON.stringify(registrationData) + "\n");
                    this.connectionList.set(registrationData.playerID, socket);
                    socket.emit("register-response", registrationData);

                } catch (error) {
                    this.l.error("while trying to register player:  " + JSON.stringify(error));
                    socket.emit("Error while trying to register ", error);
                }
            });

            // set number  event 
            // data has gameID,PID, current number 
            socket.on("number", async (data) => {
                this.l.info("server received number request for number: "+data.currentNumber);
                this.validateNumberEvent(data, socket);

                try {
                    if (this.gameController.doesGameExist(data)) {
                        await this.gameController.setNumber(data);
                    }
                    else socket.emit("Error", "The game ID: " + data.gameID + " does not correspond to any ongoing game");

                } catch (error) {
                    this.l.debug("DEBUG: SET NUMBER " + JSON.stringify(data));
                    this.l.error("while setting number " + JSON.stringify(error));
                    socket.emit("Error", "an error occured while trying to update the database " + error);
                }
                // get receiving socket 
                try {
                    const receivingSocket = await this.getSocket(data);
                    if (receivingSocket) {
                        receivingSocket.emit("get-number", data.currentNumber);
                    }
                } catch (error) {
                    this.l.error("while retreiving socket " + error);
                    socket.emit("Error", error);
                }
                // end of number event 
            });
            socket.on("disconnect", () => {
                this.connectionList.forEach((value, key, m) => {
                    if (value === socket) {
                        m.delete(key);
                        this.l.info("Socket disconected");
                    }
                });
            });
        })

        this.server.listen(3000, () => {
            this.l.info(" server is running ");
        });
    }
    async getSocket(data) {
        const game = await this.gameController.getGame(data);
        // if true  = if closed => both players have joined 
        if (game.gameStatus) {
            if (data.playerID === game.player1ID) return this.connectionList.get(game.player2ID);
            else if (data.playerID == game.player2ID) return this.connectionList.get(game.player1ID);
            else throw new Error("you are not a player in the game with ID: " + data.gameID);
        } return;
    }
    // TODO: should probably throw or return some value 
    validateRegisterEvent(data, socket) {
        if (data) {
            socket.emit("Error", "register event does not require data");
            return;
        } return;
    }
    validateNumberEvent(data, socket) {
        if (!data.gameID) {
            socket.emit("Error", "number event requires the game ID");
            return;
        }
        else if (!data.playerID) {
            socket.emit("Error", "number event requires the player ID");
            return;
        }
        else if (!data.currentNumber) {
            socket.emit("Error", "number event requires the computed number");
            return;
        }
        return;
    }
}