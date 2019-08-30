"use strict";

const game = require('../models/game');

module.exports = class DatabaseService {

    constructor(databaseConnection) {
        //TODO: remove this connection member 
        this.connection = databaseConnection;
        this.gameInstance = game.gameModel(databaseConnection);
    }

    create(game) {
        const newGame = new this.gameInstance({

            player1ID: game.player1ID,
            player2ID: game.player2ID,
            player1Status: game.player1Status,
            player2Status: game.player2Status,
            gameStatus: game.gameStatus,
            currentNumber: game.currentNumber
        });
        return new Promise((resolve, reject) => {

            newGame.save((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });

    }

    findById(gameId) {
        return new Promise((resolve, reject) => {

            this.gameInstance.findById(gameId, (err, game) => {
                if (err) {
                    reject(err);
                }
                resolve(game);

            });
        });
    }

}