require('dotenv').config();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    pingTimeout: 60000,
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
            socket.on("number", async (data, ack) => {
                this.l.info("server received number request for number: " + data.currentNumber);
                let err = this.validateNumberEvent(data);
                if (err) {
                    this.l.error(err);
                    socket.emit("Error", err);
                    return;
                }
                try {
                    if (this.gameController.doesGameExist(data)) {
                        await this.gameController.setNumber(data);
                        this.l.info("setgame executed");
                        ack(true);
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

            socket.on("gameOver", async (message) => {
                try {
                    const receivingSocket = await this.getSocket(message);
                    if (receivingSocket) {
                        receivingSocket.emit("gameOver-gg", message.message);
                    }

                } catch (error) {
                    this.l.error("while retreiving socket " + error);
                    socket.emit("Error", error);
                }
            });
            
            // disconnect on user demand 
            socket.on("connectiondown", () => {
                this.l.info("Got a disconnection request");
                this.connectionList.forEach((value, key, m) => {
                    if (value === socket) {
                        m.delete(key);
                        this.l.info("Socket disconected");
                        socket.disconnect();
                    }
                });

            });

            // disconnect event fired by IO lib 
            socket.on("disconnect", () => {
                this.connectionList.forEach((value, key, m) => {
                    if (value === socket) {
                        m.delete(key);
                        this.l.info("Socket disconected");
                    }
                });
            })
        })

        this.server.listen(process.env.API_PORT, () => {
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

    validateRegisterEvent(data, socket) {
        if (data) {
            socket.emit("Error", "register event does not require data");
            return;
        } return;
    }
    validateNumberEvent(data) {
        let err;
        if (!data.gameID) {
            err = new Error("number event requires the game ID");
            this.l.error("Missing the game ID");
        }
        else if (!data.playerID) {
            err = new Error("number event requires the player ID");
            this.l.error("Missing the player ID");
        }
        else if (!data.currentNumber && data.currentNumber !==0) {
            err = new Error("number event requires the computed number");
            this.l.error("Missing the current number");
        }
        if (err) return err.message;
        else return;

    }
}