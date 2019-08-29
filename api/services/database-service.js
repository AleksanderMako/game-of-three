"use strict";

const mongoose = require('mongoose');
const game = require('../models/game');

module.exports = class DatabaseService {

    constructor(databaseConnection) {
        this.connection = databaseConnection;
        this.gameInstance = game.gameModel();
    }
}