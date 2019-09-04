const logger = require("../config/logger");
module.exports = class GameController {
    constructor(databaseService, constants) {
        this.dbService = databaseService;
        this.constants = constants;
        this.l = logger();
    }

    async setNumber(data) {
        // pull document by id 
        let updatedGame;
        const game = await this.getGame(data);

        // set the currentNumber to data.number
        game.currentNumber = data.currentNumber;

        try {
            updatedGame = await this.dbService.update(game);
        } catch (error) {
            this.l.error("ERROR in game controller setNumber : " + err);
            throw new Error("Error in game controller setNumber " + JSON.stringify(error));
        }
        if (updatedGame.currentNumber !== data.currentNumber) {
            this.l.debug("DEBUG: number in database is  " + updatedGame.currentNumber);
            this.l.debug("DEBUG: game object in database is  " + JSON.stringify(updatedGame));
            throw new Error("current number in Database was not updated");
        }
    }

    async getNumber(data) {
        // pull document by id 
        let game;
        try {
            game = await this.getGame(data);

        } catch (error) {
            this.l.error("Error in game controller getNumber " + JSON.stringify(error));
            throw new Error("Error in game controller getNumber " + JSON.stringify(error));
        }
        return game.currentNumber;
    }

    async doesGameExist(data) {
        let game;
        try {
            game = await this.getGame(data);

        } catch (error) {
            this.l.error("Error in game controller doesGameExist " + JSON.stringify(error));
            throw new Error("Error in game controller doesGameExist " + JSON.stringify(error));
        }
        if (game) return true;
        return false;
    }

    async getGame(data) {

        let game;
        try {
            game = await this.dbService.findById(data.gameID);

        } catch (error) {
            this.l.error("Error in game controller getGame " + JSON.stringify(error))
            throw new Error("Error in game controller get game " + JSON.stringify(error));
        }
        return game;
    }
}