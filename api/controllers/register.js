"use strict";
const uuidv1 = require('uuid/v1');
const logger = require("../config/logger");
module.exports = class RegisterController {
    constructor(databaseService, constants) {

        this.dbService = databaseService;
        this.constants = constants;
        this.l = logger();
    }

    async registerPlayer() {
        const playerID = uuidv1();
        let openGame;
        let gameID;
        let updatedDoc;
        // check if there any open games to join 
        try {
            openGame = await this.dbService.findOpenGame();
        } catch (error) {
            this.l.error("Error in register controller registerPlayer while trying to find open game: "+ JSON.stringify(error));
            throw new Error("Error in register controller registerPlayer while trying to find open game: "+ JSON.stringify(error));
        }

        // generate new game record if there are no open games 

        if (!openGame) {
            const newGame = {
                player1ID: playerID,
                player2ID: "",
                player1Status: this.constants.online,
                player2Status: this.constants.offline,
                gameStatus: this.constants.awaitingPlayer,
                currentNumber: -1.5
            };
            try {
                gameID = await this.dbService.create(newGame);
            } catch (error) {
                this.l.error("ERROR: error while creating object \n" + error)
                throw new Error("Error in register controller registerPlayer while trying to create a game: "+ JSON.stringify(error));
            }
            return {
                playerID: playerID,
                gameID: gameID
            }
        }
        // otherwise just join an open game 
        else {
            var game = openGame;
            game.player2ID = playerID;
            game.player2Status = this.constants.online;
            game.gameStatus = this.constants.closed;

            try {
                updatedDoc = await this.dbService.update(game);

            } catch (error) {
                this.l.error("Error in register controller registerPlayer while trying to join the game: "+ JSON.stringify(error));
                throw new Error("Error in register controller registerPlayer while trying to join the game: "+ JSON.stringify(error));
            }
            gameID = updatedDoc._id;

            return {
                playerID: playerID,
                gameID: gameID,
                currentNumber: updatedDoc.currentNumber
            }
        }


    }

}