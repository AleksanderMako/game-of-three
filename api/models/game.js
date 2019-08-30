"use strict";
const mongoose = require('mongoose');
const schema = mongoose.Schema;

function gameModel(db) {
    const gameID = schema.ObjectId;
    const gameSchema = new schema({

        gameId: gameID,

        player1ID: {
            type: String,
            required: true
        },
        player2ID: {
            type: String,
            required: true
        },
        player1Status: {
            type: Boolean,
            required: true
        },
        player2Status: {
            type: Boolean,
            required: true
        },
        gameStatus: {
            type: Boolean,
            required: true
        },
        currentNumber: {
            type: Number,
            required: true
        }
    });
    const gameModel = db.model("game", gameSchema);
    return gameModel;

}
module.exports = {
    gameModel
};