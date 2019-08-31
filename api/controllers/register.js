"use strict";
const uuidv1 = require('uuid/v1');

module.exports = class RegisterController {
    constructor(databaseService, constants) {

        this.dbService = databaseService;
        this.constants = constants;
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
            //TODO: handle this error
        }

        // generate new game record if there are no open games 

        if (!openGame) {
            const newGame = {
                player1ID: playerID,
                player2ID: "",
                player1Status: this.constants.online,
                player2Status: this.constants.offline,
                gameStatus: this.constants.awaitingPlayer,
                currentNumber: -1
            };
            try {
                gameID = await this.dbService.create(newGame);
            } catch (error) {
                console.log("ERROR: error while creating object \n" + error )
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
                //TODO: handle this error;
            }
            gameID = updatedDoc.id;
        }

        return {
            playerID: playerID,
            gameID: gameID
        }
    }

}