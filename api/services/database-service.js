"use strict";

const game = require('../models/game');

module.exports = class DatabaseService {

    constructor( gameSchema ,constants) {
        this.gameInstance = gameSchema;
        this.constants = constants;
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

            newGame.save((err, doc) => {
                if (err) {
                    reject(err);
                }
                resolve(doc._id);
            });
        });

    }

    findById(gameId) {
        return new Promise((resolve, reject) => {

            this.gameInstance.findById(gameId, (err, game) => {
                if (err) {
                    reject(err);
                }
                if(game){
                    resolve(game.toObject());
                }
                else resolve();
            });
        });
    }

    findOpenGame() {
        return new Promise((resolve, reject) => {
            this.gameInstance.findOne({ gameStatus: this.constants.awaitingPlayer }, (err, game) => {
                // there should be one game open at all times
                if (err) {
                    reject(err);
                }
                if (game) {
                    resolve(game.toObject());

                } else resolve();
            });
        });

    }

    update(game) {
        return new Promise((resolve, reject) => {
            this.gameInstance.findOneAndUpdate({ _id: game._id }, {
                player1ID: game.player1ID,
                player2ID: game.player2ID,
                player1Status: game.player1Status,
                player2Status: game.player2Status,
                gameStatus: game.gameStatus,
                currentNumber: game.currentNumber

            }, {new:true},(err, doc) => {
                if (err) {
                    reject(err);
                }
                resolve(doc.toObject());
            });
        });
    }

}